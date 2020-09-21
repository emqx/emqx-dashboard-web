<template>
  <a-card class="zone-settings emq-list-card">
    <el-tabs v-model="settingType" :before-leave="handleBeforeLeave">
      <el-tab-pane v-for="(item, index) in zoneList" :key="index" :label="item.name" :name="item.name">
        <config-form
          v-if="settingType === item.name && item.configs"
          :ref="item.name"
          :record="item.configs"
          :rules="rules"
          :btn-loading="saveLoading"
          v-model="disabled"
          v-bind="allOptions"
          @update="handleUpdate(...arguments, item.name)"
        >
        </config-form>
        <template v-else>
          <a-skeleton active></a-skeleton>
        </template>
      </el-tab-pane>
      <el-tab-pane label="" name="add">
        <span slot="label" size="mini">
          <i class="el-icon-plus"></i>
        </span>
      </el-tab-pane>
    </el-tabs>
  </a-card>
</template>

<script>
import { loadConfig, updateConfig } from '../../api/settings'
import ConfigForm from './components/ConfigForm'
import { validRanger } from '@/common/utils'
import { allOptions } from '@/common/settingsData'

export default {
  name: 'ZoneSettings',

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
      settingType: 'external',
      rules: {
        max_subscriptions: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 65536])
            },
            trigger: 'blur',
          },
        ],
        max_awaiting_rel: [{ required: true, message: this.$t('Settings.pleaseEnter') }],
        max_inflight: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 256])
            },
            trigger: 'blur',
          },
        ],
        max_mqueue_len: [{ required: true, message: this.$t('Settings.pleaseEnter') }],
      },
      disabled: false,
      zoneList: [],
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
      if (activeName !== oldName && oldName !== 'add') {
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
      const { zoneResList } = await loadConfig()
      this.zoneList = zoneResList
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
