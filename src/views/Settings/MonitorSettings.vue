<template>
  <a-card class="monitor-settings emq-list-card">
    <el-tabs v-model="settingType" :before-leave="handleBeforeLeave">
      <el-tab-pane v-for="(item, index) in monitorList" :key="index" :label="item.type" :name="item.type">
        <config-form
          v-if="settingType === item.type && item.configs"
          :ref="item.type"
          :record="item.configs"
          :rules="item.rules"
          :btn-loading="saveLoading"
          v-model="disabled"
          labelWidth="255px"
          @update="handleUpdate(...arguments, item.type)"
        >
        </config-form>
        <template v-else>
          <a-skeleton active></a-skeleton>
        </template>
      </el-tab-pane>
    </el-tabs>
  </a-card>
</template>

<script>
import { loadConfig, updateConfig } from '../../api/settings'
import ConfigForm from './components/ConfigForm'

export default {
  name: 'MonitorSettings',

  components: {
    ConfigForm,
  },

  data() {
    return {
      saveLoading: false,
      settingType: 'vm_mon',
      disabled: false,
      monitorList: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async handleBeforeLeave(activeName, oldName) {
      if (activeName !== oldName) {
        if (!this.disabled) {
          const status = await this.$confirm(this.$t('Settings.noSaveConfirm'), {
            type: 'warning',
            cancelButtonText: this.$t('Settings.no'),
          })
          if (status === 'confirm') {
            this.$refs[oldName][0].cancel(false)
            return true
          }
          return false
        }
      }
      return true
    },
    async loadData() {
      const { monitorResList } = await loadConfig()
      this.monitorList = monitorResList
      monitorResList.forEach((item) => {
        item.rules = {}
        Object.keys(item.configs).forEach((key) => {
          item.rules[key] = [{ required: true, message: this.$t('Settings.pleaseEnter') }]
        })
      })
    },
    async handleUpdate(data, type) {
      this.saveLoading = true
      const res = await updateConfig(type, data)
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
