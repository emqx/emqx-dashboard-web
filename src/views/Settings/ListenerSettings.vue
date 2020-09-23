<template>
  <a-card class="listener-settings emq-list-card">
    <el-tabs v-model="settingType" :before-leave="handleBeforeLeave">
      <el-tab-pane
        v-for="(item, index) in listenerList"
        :key="index"
        :label="`${item.transport_type}_${item.name}`"
        :name="`${item.transport_type}_${item.name}`"
      >
        <config-detail
          v-if="settingType === `${item.transport_type}_${item.name}` && item.configs"
          :ref="`${item.transport_type}_${item.name}`"
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
      <el-tab-pane label="" name="addListener">
        <span slot="label" size="mini">
          <i class="el-icon-plus"></i>
        </span>
        <config-detail
          v-if="settingType === 'addListener'"
          oper="add"
          ref="addListener"
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
import { loadConfig, updateOneConfig, loadConfigSpec, addOneConfig } from '../../api/settings'
import ConfigDetail from './components/ConfigDetail'
import { renderParamsForm } from '@/common/utils'

export default {
  name: 'ListenerSettings',

  components: {
    ConfigDetail,
  },

  data() {
    return {
      listenerList: [],
      saveLoading: false,
      settingType: 'ssl_external',
      disabled: false,
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
      const { zone, ...listeners } = await loadConfigSpec()
      // listeners: { ws: {}, tcp: {}, ... }
      Object.keys(listeners).forEach((type) => {
        const diffTypeConfig = listeners[type]
        Object.keys(diffTypeConfig).forEach((key) => {
          diffTypeConfig[key].description = diffTypeConfig[key].description[this.lang]
        })
        this.configData[type] = renderParamsForm(diffTypeConfig, 'configs')
      })
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
      const { listenersResList } = await loadConfig()
      this.listenerList = listenersResList
      this.loadConfigData()
    },
    async handleUpdate(name, record) {
      this.saveLoading = true
      let res
      if (this.settingType !== 'addListener') {
        res = await updateOneConfig('listeners', this.settingType, record)
      } else {
        res = await addOneConfig('listeners', { name, configs: record })
      }
      if (res) {
        this.disabled = true
        this.$message.success(this.$t('Base.applySuccess'))
        this.loadData()
      }
      this.saveLoading = false
    },
  },
}
</script>
