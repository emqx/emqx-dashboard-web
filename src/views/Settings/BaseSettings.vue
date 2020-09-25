<template>
  <a-card class="base-settings emq-list-card">
    <config-form
      v-if="mqttRecord"
      class="base-form"
      ref="mqttForm"
      :record="mqttRecord"
      :rules="rules"
      :btn-loading="saveLoading"
      v-model="disabled"
      v-bind="allOptions"
      labelWidth="260px"
      @update="handleUpdate(...arguments, 'emqx')"
    >
    </config-form>
    <template v-else>
      <a-skeleton active></a-skeleton>
    </template>
  </a-card>
</template>

<script>
import { loadConfig, updateConfig } from '../../api/settings'
import ConfigForm from './components/ConfigForm'
import { validRanger } from '@/common/utils'
import { allOptions } from '@/common/settingsData'

export default {
  name: 'BaseSettings',

  components: {
    ConfigForm,
  },

  data() {
    const validType = (rule, value, callback, { type, unit }) => {
      let validMsg = ''
      const regOptions = {
        duration: /\d[smhd]$/,
        bytes: /\dMB|GB|KB/,
        number: /^\d{1,}$/,
        float: /^\d+\.\d+$/,
      }
      let messageError = this.$t('Settings.errorUnit', { unit })
      if (type === 'number' || type === 'float') {
        messageError = this.$t('Settings.errorType', { type })
      }
      const regType = regOptions[type]
      validMsg = regType.test(value) ? '' : messageError
      if (validMsg !== '') {
        callback(new Error(validMsg))
      }
      callback()
    }
    return {
      saveLoading: false,
      mqttRecord: null,
      initMqtt: {},
      rules: {
        mqtt_max_clientid_len: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [23, 65535])
            },
            trigger: 'blur',
          },
        ],
        mqtt_max_topic_alias: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 65535])
            },
            trigger: 'blur',
          },
        ],
        acl_cache_ttl: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'duration', unit: 's, h, m, d' })
            },
            trigger: 'blur',
          },
        ],
        mqtt_max_packet_size: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'bytes', unit: 'KB, MB, GB' })
            },
            trigger: 'blur',
          },
        ],
        mqtt_max_topic_levels: { required: true, message: this.$t('Settings.pleaseEnter') },
        acl_cache_max_size: { required: true, message: this.$t('Settings.pleaseEnter') },
        flapping_detect_policy: { required: true, message: this.$t('Settings.pleaseEnter') },
      },
      disabled: false,
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
    async loadData() {
      const { mqttRes } = await loadConfig()
      this.mqttRecord = mqttRes
      // 加载数据重新赋值 init
      Object.assign(this.initMqtt, mqttRes)
    },
    async handleUpdate(data, type) {
      this.saveLoading = true
      const res = await updateConfig(type, data)
      if (res) {
        this.disabled = true
        this.$message.success(this.$t('Base.applySuccess'))
        // 保存成功后赋值到 init 的值
        Object.assign(this.initMqtt, this.mqttRecord)
        this.loadData()
      }
      this.saveLoading = false
    },
  },
}
</script>

<style lang="scss">
.base-settings .base-form {
  .el-form {
    margin-top: 0;
  }
}
</style>
