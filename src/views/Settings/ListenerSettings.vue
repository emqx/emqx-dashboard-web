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
          :configOptions="configOptions"
          :listenerType="item.transport_type"
          :btn-loading="saveLoading"
          labelWidth="170px"
          :listenerZoneOptions="listenerZoneOptions"
          v-model="disabled"
          @update="handleUpdate(...arguments, item.name)"
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
          :configOptions="configOptions"
          :btn-loading="saveLoading"
          labelWidth="170px"
          :listenerZoneOptions="listenerZoneOptions"
          @update="handleUpdate(...arguments)"
        ></config-detail>
      </el-tab-pane>
    </el-tabs>
  </a-card>
</template>

<script>
import { loadZoneConfigs, loadlistenerConfigs, updateOneConfig, loadConfigSpec, addOneConfig } from '../../api/settings'
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
      settingType: 'tcp_external',
      disabled: false,
      configData: {},
      configOptions: {},
      listenerZoneOptions: [],
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
    sortListener(valOne, valTwo) {
      const listenerOne = valOne.configs.listener
      const listenerTwo = valTwo.configs.listener
      const resA = listenerOne.includes(':') ? listenerOne.split(':')[1] : listenerOne
      const resB = listenerTwo.includes(':') ? listenerTwo.split(':')[1] : listenerTwo
      if (parseInt(resA, 10) < parseInt(resB, 10)) {
        return -1
      }
      if (parseInt(resA, 10) === parseInt(resB, 10)) {
        return 0
      }
      return 1
    },
    async loadConfigData() {
      const { zone, ...listeners } = await loadConfigSpec()
      // listeners: { ws: {}, tcp: {}, ... }
      Object.keys(listeners).forEach((type) => {
        const diffTypeConfig = listeners[type]
        Object.keys(diffTypeConfig).forEach((key) => {
          diffTypeConfig[key].description = diffTypeConfig[key].description[this.lang]
        })
        if (type === 'tcp') {
          // common configs
          this.configData = renderParamsForm(diffTypeConfig, 'configs')
          this.configOptions[type] = {}
        } else {
          this.configOptions[type] = renderParamsForm(diffTypeConfig, 'configs')
        }
      })
      // wss: ssl+tcp+ws
      const { ...sslConfigs } = this.configOptions.ssl
      const { ...wsConfigs } = this.configOptions.ws
      this.configOptions.wss = {
        form: wsConfigs.form.concat(sslConfigs.form),
        rules: Object.assign(sslConfigs.rules, wsConfigs.rules),
      }
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
      this.listenerZoneOptions = []
      const listenersResList = await loadlistenerConfigs()
      const zoneResList = await loadZoneConfigs()
      zoneResList.forEach((item) => {
        const oneZoneOption = {
          label: item.name,
          value: item.name,
        }
        this.listenerZoneOptions.push(oneZoneOption)
      })
      this.listenerList = listenersResList.sort(this.sortListener)
      this.loadConfigData()
    },
    async handleUpdate(name, record, type, listenerName) {
      this.saveLoading = true
      let data
      const { ...configs } = record
      if (this.settingType !== 'addListener') {
        data = { transport_type: type, configs }
        this.$confirm(this.$t('Settings.confirmUpdateListener'), this.$t('Base.warning'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
          .then(async () => {
            const res = await updateOneConfig('listeners', listenerName, data)
            if (res) {
              this.settingType = `${type}_${listenerName}`
              this.updataSuccess(name)
            }
          })
          .catch(() => {})
      } else {
        data = { name, transport_type: type, configs }
        const res = await addOneConfig('listeners', data)
        if (res) {
          this.settingType = `${type}_${name}`
          this.updataSuccess(name)
        }
      }
      this.saveLoading = false
    },
    updataSuccess(name) {
      this.loadData()
      this.disabled = true
      if (!name) {
        this.$message.success(this.$t('Base.applySuccess'))
      } else {
        this.$message.success(this.$t('Base.createSuccess'))
      }
    },
  },
}
</script>
