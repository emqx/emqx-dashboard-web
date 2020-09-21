<template>
  <a-card class="other-settings emq-list-card">
    <el-tabs v-model="settingType" :before-leave="handleBeforeLeave">
      <el-tab-pane v-for="(item, index) in otherList" :key="index" :label="item.type" :name="item.type">
        <config-form
          v-if="settingType === item.type && item.configs"
          :ref="item.type"
          :record="item.configs"
          :rules="rules"
          :btn-loading="saveLoading"
          v-model="disabled"
          v-bind="allOptions"
          labelWidth="190px"
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
import { allOptions } from '@/common/settingsData'

export default {
  name: 'OtherSettings',

  components: {
    ConfigForm,
  },

  data() {
    return {
      saveLoading: false,
      externalRecord: null,
      initExternal: {},
      internalRecord: null,
      initInternal: {},
      settingType: 'cluster',
      rules: {},
      disabled: false,
      otherList: [],
    }
  },

  computed: {
    allOptions() {
      return allOptions
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async handleBeforeLeave(activeName, oldName) {
      if (activeName !== oldName) {
        if (!this.disabled) {
          const status = await this.$confirm(this.$t('Settings.noSaveConfirm'), this.$t('Base.warning'), {
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
      const { otherResList } = await loadConfig()
      this.otherList = otherResList
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
