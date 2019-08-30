<template>
  <a-card
    class="basic-config emq-list-card"
  >
    <div class="basic-config-type">
      <el-radio-group v-model="settingType" size="small" border>
        <el-radio-button label="external">
        </el-radio-button>
        <el-radio-button label="internal">
        </el-radio-button>
      </el-radio-group>
    </div>

    <template v-if="settingType === 'external'">
      <external-form
        :record="externalRecord"
        :rules="rules"
        :btn-loading="saveLoading"
        :cancel-disabled="disabled"
        :cancel="cancel"
        v-bind="allOptions"
        @update="handleUpdate"
      >
      </external-form>
    </template>

    <template v-if="settingType === 'internal'">
      <internal-form
        :record="internalRecord"
        :rules="rules"
        :btn-loading="saveLoading"
        :cancel-disabled="disabled"
        :cancel="cancel"
        v-bind="allOptions"
        @update="handleUpdate"
      >
      </internal-form>
    </template>

  </a-card>
</template>


<script>
import { setTimeout, clearTimeout } from 'timers'
import { loadConfig, updateConfig } from '../../api/settings'
import ExternalForm from './components/ExternalForm'
import InternalForm from './components/InternalForm'

export default {
  name: 'BasicConfig',

  components: {
    ExternalForm,
    InternalForm,
  },

  data() {
    const validRanger = (rule, value, callback, range) => {
      const getValidMsg = (_range, _value) => {
        const [min, max] = _range.sort((prev, next) => prev - next)
        const floatValue = parseFloat(_value, 10)
        return (floatValue > max || floatValue < min) ? this.$t('Settings.errorRange', { min, max }) : ''
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
      externalRecord: {},
      initExternal: {},
      internalRecord: {},
      initInternal: {},
      settingType: 'external',
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
        max_topic_alias: [
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
        flapping_banned_expiry_interval: [
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
        flapping_threshold: { required: true, message: this.$t('Settings.pleaseEnter') },
        max_packet_size: { required: true, message: this.$t('Settings.pleaseEnter') },
        max_topic_levels: { required: true, message: this.$t('Settings.pleaseEnter') },
      },
    }
  },

  watch: {
    // 当配置改变的时候，才可以取消恢复到原来的值
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
      const { externalRes, internalRes } = await loadConfig()
      if (externalRes && internalRes) {
        this.externalRecord = externalRes
        this.internalRecord = internalRes
        // 加载数据重新赋值 init
        Object.assign(this.initExternal, externalRes)
        Object.assign(this.initInternal, internalRes)
      }
    },
    async handleUpdate(type, data) {
      this.saveLoading = true
      const res = await updateConfig(type, data)
      if (res) {
        this.disabled = true
        this.$message.success(this.$t('Base.applySuccess'))
        // 保存成功后赋值到 init 的值
        Object.assign(this.initExternal, this.externalRecord)
        Object.assign(this.initInternal, this.internalRecord)
      }
      this.saveLoading = false
    },
    cancel(needPrompt = true) {
      const confirmCancel = () => {
        // 取消后还原 init 值
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
        }).then(() => {
          confirmCancel()
        }).catch(() => {})
      } else {
        confirmCancel()
      }
    },
  },
}
</script>


<style lang="scss">
.basic-config {
  .basic-config-form {
    margin-top: 40px;
    .form-item-desc {
      min-height: 55px;
      font-size: 13px;
      color: #676767;
    }

    .form-item-input {
      width: 60%;
    }

    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
      color: transparent;
    }
  }

  .button-group__center {
    margin-top: 20px;
  }

  .el-select.emq-select {
    width: 60%;
  }
}
</style>
