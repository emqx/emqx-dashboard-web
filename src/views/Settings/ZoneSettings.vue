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
          @update="handleUpdate(...arguments)"
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
          @update="handleUpdate(...arguments)"
        ></config-detail>
      </el-tab-pane>
    </el-tabs>
  </a-card>
</template>

<script>
import { loadZoneConfigs, updateOneConfig, loadConfigSpec, addOneConfig } from '../../api/settings'
import ConfigDetail from './components/ConfigDetail'
import { renderParamsForm } from '@/common/utils'

export default {
  name: 'ZoneSettings',

  components: {
    ConfigDetail,
  },

  data() {
    return {
      saveLoading: false,
      settingType: 'external',
      disabled: false,
      zoneList: [],
      configData: {},
    }
  },

  computed: {
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
      const zoneResList = await loadZoneConfigs()
      this.zoneList = zoneResList
      this.loadConfigData()
    },
    async handleUpdate(name, record) {
      this.saveLoading = true
      let res
      if (this.settingType !== 'addZone') {
        res = await updateOneConfig('zones', this.settingType, record)
      } else {
        res = await addOneConfig('zones', { name, configs: record })
      }
      if (res) {
        this.disabled = true
        this.loadData()
        this.settingType = name || this.settingType
        this.updataSuccessTip(name)
      }
      this.saveLoading = false
    },
    updataSuccessTip(name) {
      if (!name) {
        this.$message.success(this.$t('Base.applySuccess'))
      } else {
        this.$message.success(this.$t('Base.createSuccess'))
      }
    },
  },
}
</script>
