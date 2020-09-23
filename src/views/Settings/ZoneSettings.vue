<template>
  <a-card class="zone-settings emq-list-card">
    <el-tabs v-model="settingType" :before-leave="handleBeforeLeave">
      <el-tab-pane v-for="(item, index) in zoneList" :key="index" :label="item.name" :name="item.name">
        <config-detail
          v-if="settingType === item.name && item.configs"
          :ref="item.name"
          oper="edit"
          :editConfig="item.configs"
          :configData="configData"
          :btn-loading="saveLoading"
          v-model="disabled"
          @update="handleUpdate(...arguments, item.name)"
        >
        </config-detail>
        <template v-else>
          <a-skeleton active></a-skeleton>
        </template>
      </el-tab-pane>
      <el-tab-pane label="" name="addZone">
        <span slot="label" size="mini">
          <i class="el-icon-plus"></i>
        </span>
        <config-detail
          v-if="settingType === 'addZone'"
          oper="add"
          ref="addZone"
          v-model="disabled"
          :configData="configData"
          :btn-loading="saveLoading"
          @update="handleCreate(...arguments)"
        ></config-detail>
      </el-tab-pane>
    </el-tabs>
  </a-card>
</template>

<script>
import { loadConfig, updateZoneConfig, loadConfigSpec, addZoneConfig } from '../../api/settings'
import ConfigDetail from './components/ConfigDetail'
import { renderParamsForm } from '@/common/utils'
import { allOptions } from '@/common/settingsData'

export default {
  name: 'ZoneSettings',

  components: {
    ConfigDetail,
  },

  data() {
    return {
      saveLoading: false,
      externalRecord: null,
      initExternal: {},
      internalRecord: null,
      initInternal: {},
      settingType: 'external',
      disabled: false,
      zoneList: [],
      configData: {},
    }
  },

  computed: {
    allOptions() {
      return allOptions
    },
    lang() {
      return this.$store.state.lang
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadConfigData() {
      const { zone } = await loadConfigSpec()
      Object.keys(zone).forEach((key) => {
        zone[key].description = zone[key].description[this.lang]
      })
      this.configData = renderParamsForm(zone, 'configs')
    },
    async handleBeforeLeave(activeName, oldName) {
      if (activeName !== oldName) {
        if (!this.disabled) {
          const status = await this.$confirm(this.$t('Settings.noSaveConfirm'), this.$t('Base.warning'), {
            type: 'warning',
            cancelButtonText: this.$t('Settings.no'),
          })
          if (status === 'confirm') {
            const child = this.$refs[oldName].length ? this.$refs[oldName][0] : this.$refs[oldName]
            child.cancel(false)
            return true
          }
          return false
        }
      }
      return true
    },
    async loadData() {
      const { zoneResList } = await loadConfig()
      this.zoneList = zoneResList
      this.loadConfigData()
    },
    async handleUpdate(data, type) {
      this.saveLoading = true
      const res = await updateZoneConfig(type, data)
      if (res) {
        this.disabled = true
        this.$message.success(this.$t('Base.applySuccess'))
        this.loadData()
      }
      this.saveLoading = false
    },
    async handleCreate(name, record) {
      this.saveLoading = true
      const res = await addZoneConfig({ name, configs: record })
      if (res) {
        this.loadData()
      }
      this.saveLoading = false
    },
  },
}
</script>
