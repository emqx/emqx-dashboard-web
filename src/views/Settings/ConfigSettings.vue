<template>
  <a-card class="config-settings emq-list-card">
    <div class="tabs-title">{{ $t('Settings.zone') }}</div>

    <el-tabs v-model="settingType">
      <el-tab-pane label="base" name="mqtt">
        <config-form
          v-if="settingType === 'mqtt' && mqttRecord"
          ref="mqttForm"
          :record="mqttRecord"
          :rules="rules"
          :btn-loading="saveLoading"
          :cancel-disabled="disabled"
          :cancel="cancel"
          v-bind="allOptions"
          @update="handleUpdate(...arguments, 'mqtt')"
        >
        </config-form>
        <template v-else>
          <a-skeleton active></a-skeleton>
        </template>
      </el-tab-pane>

      <el-tab-pane label="external" name="external">
        <config-form
          v-if="settingType === 'external' && externalRecord"
          ref="externalForm"
          :record="externalRecord"
          :rules="rules"
          :btn-loading="saveLoading"
          :cancel-disabled="disabled"
          :cancel="cancel"
          v-bind="allOptions"
          @update="handleUpdate(...arguments, 'external')"
        >
        </config-form>
      </el-tab-pane>

      <el-tab-pane label="internal" name="internal">
        <config-form
          v-if="settingType === 'internal' && internalRecord"
          ref="internalForm"
          :record="internalRecord"
          :rules="rules"
          :btn-loading="saveLoading"
          :cancel-disabled="disabled"
          :cancel="cancel"
          v-bind="allOptions"
          @update="handleUpdate(...arguments, 'internal')"
        >
        </config-form>
      </el-tab-pane>
    </el-tabs>
  </a-card>
</template>

<script>
import { setTimeout, clearTimeout } from 'timers'
import { loadConfig, updateConfig } from '../../api/settings'
import ConfigForm from './components/ConfigForm'

export default {
  name: 'BasicConfig',

  components: {
    ConfigForm,
  },

  data() {
    const validRanger = (rule, value, callback, range) => {
      const getValidMsg = (_range, _value) => {
        const [min, max] = _range.sort((prev, next) => prev - next)
        const floatValue = parseFloat(_value, 10)
        return floatValue > max || floatValue < min ? this.$t('Settings.errorRange', { min, max }) : ''
      }
      const validMsg = getValidMsg(range, value)
      if (validMsg !== '') {
        callback(new Error(validMsg))
      }
      callback()
    }
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
      timer: 0,
      disabled: true,
      saveLoading: false,
      mqttRecord: null,
      initMqtt: {},
      externalRecord: null,
      initExternal: {},
      internalRecord: null,
      initInternal: {},
      settingType: 'mqtt',
      allOptions: {
        boolOptions: [
          { label: 'true', value: true },
          { label: 'false', value: false },
        ],
        permitOptions: [
          { label: 'allow', value: 'allow' },
          { label: 'deny', value: 'deny' },
        ],
        actionOptions: [
          { label: 'ignore', value: 'ignore' },
          { label: 'disconnect', value: 'disconnect' },
        ],
        enableOptions: [
          { label: 'on', value: 'on' },
          { label: 'off', value: 'off' },
        ],
        priorityOptions: [
          { label: 'highest', value: 'highest' },
          { label: 'lowest', value: 'lowest' },
        ],
        qosOptions: [
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
        ],
      },
      rules: {
        keepalive_backoff: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0.2, 5.0])
            },
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'float' })
            },
            trigger: 'blur',
          },
        ],
        max_subscriptions: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 65536])
            },
            trigger: 'blur',
          },
        ],
        max_awaiting_rel: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 500])
            },
            trigger: 'blur',
          },
        ],
        max_inflight: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 256])
            },
            trigger: 'blur',
          },
        ],
        max_mqueue_len: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 2048])
            },
            trigger: 'blur',
          },
        ],
        max_clientid_len: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [23, 65535])
            },
            trigger: 'blur',
          },
        ],
        mqtt_max_clientid_len: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [23, 65535])
            },
            trigger: 'blur',
          },
        ],
        max_topic_alias: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 65535])
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
        await_rel_timeout: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'duration', unit: 's, h, m, d' })
            },
            trigger: 'blur',
          },
        ],
        retry_interval: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'duration', unit: 's, h, m, d' })
            },
            trigger: 'blur',
          },
        ],
        idle_timeout: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'duration', unit: 's, h, m, d' })
            },
            trigger: 'blur',
          },
        ],
        hibernate_after: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'duration', unit: 's, h, m, d' })
            },
            trigger: 'blur',
          },
        ],
        force_gc_policy: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'bytes', unit: 'KB, MB, GB' })
            },
            trigger: 'blur',
          },
        ],
        session_expiry_interval: [
          { required: true, message: this.$t('Settings.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validType(rule, value, callback, { type: 'duration', unit: 's, h, m, d' })
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
        max_packet_size: { required: true, message: this.$t('Settings.pleaseEnter') },
        mqtt_max_topic_levels: { required: true, message: this.$t('Settings.pleaseEnter') },
        acl_cache_max_size: { required: true, message: this.$t('Settings.pleaseEnter') },
        flapping_detect_policy: { required: true, message: this.$t('Settings.pleaseEnter') },
      },
    }
  },

  watch: {
    // 当配置改变的时候，才可以取消恢复到原来的值
    mqttRecord: {
      deep: true,
      immediate: true,
      handler: 'handleRecordChange',
    },
    externalRecord: {
      deep: true,
      immediate: true,
      handler: 'handleRecordChange',
    },
    internalRecord: {
      deep: true,
      immediate: true,
      handler: 'handleRecordChange',
    },
  },

  created() {
    this.loadData()
  },

  beforeDestroy() {
    clearTimeout(this.timer)
  },

  methods: {
    handleRecordChange(val, oldVal) {
      if (!oldVal || JSON.stringify(oldVal) === '{}') {
        this.disabled = true
        return
      }
      this.disabled = false
    },
    async loadData() {
      const { externalRes, internalRes, mqttRes } = await loadConfig()
      if (externalRes && internalRes) {
        this.externalRecord = externalRes
        this.internalRecord = internalRes
        this.mqttRecord = mqttRes
        // 加载数据重新赋值 init
        Object.assign(this.initMqtt, mqttRes)
        Object.assign(this.initExternal, externalRes)
        Object.assign(this.initInternal, internalRes)
      }
    },
    async handleUpdate(data, type) {
      this.saveLoading = true
      const res = await updateConfig(type, data)
      if (res) {
        this.disabled = true
        this.$message.success(this.$t('Base.applySuccess'))
        // 保存成功后赋值到 init 的值
        Object.assign(this.initMqtt, this.mqttRecord)
        Object.assign(this.initExternal, this.externalRecord)
        Object.assign(this.initInternal, this.internalRecord)
      }
      this.saveLoading = false
    },
    cancel(needPrompt = true) {
      const confirmCancel = () => {
        // 取消后还原 init 值
        Object.assign(this.mqttRecord, this.initMqtt)
        Object.assign(this.externalRecord, this.initExternal)
        Object.assign(this.internalRecord, this.initInternal)
        this.timer = setTimeout(() => {
          this.disabled = true
        }, 500)
      }
      if (needPrompt) {
        this.$confirm(this.$t('Settings.cancelConfirm'), this.$t('Base.warning'), {
          type: 'warning',
          cancelButtonText: this.$t('Settings.no'),
        })
          .then(() => {
            confirmCancel()
          })
          .catch(() => {})
      } else {
        confirmCancel()
      }
    },
  },
}
</script>

<style lang="scss">
.config-settings {
  .tabs-title {
    position: absolute;
    right: 30px;
    top: 36px;
  }
}
</style>
