<template>
  <div class="settings">
    <page-header
      :back-title="$t('General.setting')"
    >
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('General.serverSetting') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
      >
        <div class="settings-type">
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
    </div>
  </div>
</template>


<script>
import { setTimeout, clearTimeout } from 'timers'
import { loadConfig, updateConfig } from '../../api/settings'
import ExternalForm from './components/ExternalForm'
import InternalForm from './components/InternalForm'

export default {
  name: 'Settings',

  components: {
    ExternalForm,
    InternalForm,
  },

  data() {
    const validRanger = (rule, value, callback, range) => {
      const getValidMsg = (_range, _value) => {
        const [min, max] = _range.sort((prev, next) => prev - next)
        const floatValue = parseFloat(_value, 10)
        return (floatValue > max || floatValue < min) ? this.$t('General.errorRange', { min, max }) : ''
      }
      const validMsg = getValidMsg(range, value)
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
      },
      rules: {
        keepalive_backoff: [
          { required: true, message: this.$t('General.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0.2, 5])
            },
            trigger: 'blur',
          },
        ],
        max_subscriptions: [
          { required: true, message: this.$t('General.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 65536])
            },
            trigger: 'blur',
          },
        ],
        max_awaiting_rel: [
          { required: true, message: this.$t('General.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 500])
            },
            trigger: 'blur',
          },
        ],
        max_inflight: [
          { required: true, message: this.$t('General.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 256])
            },
            trigger: 'blur',
          },
        ],
        max_mqueue_len: [
          { required: true, message: this.$t('General.pleaseEnter') },
          {
            validator: (rule, value, callback) => {
              validRanger(rule, value, callback, [0, 2048])
            },
            trigger: 'blur',
          },
        ],
        idle_timeout: { required: true, message: this.$t('General.pleaseEnter') },
        flapping_banned_expiry_interval: { required: true, message: this.$t('General.pleaseEnter') },
        flapping_threshold: { required: true, message: this.$t('General.pleaseEnter') },
        force_gc_policy: { required: true, message: this.$t('General.pleaseEnter') },
        await_rel_timeout: { required: true, message: this.$t('General.pleaseEnter') },
        session_expiry_interval: { required: true, message: this.$t('General.pleaseEnter') },
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
    cancel() {
      this.$confirm(this.$t('General.cancelConfirm'), this.$t('General.confirm'), {
        cancelButtonText: this.$t('General.no'),
      }).then(() => {
        // 取消后还原 init 值
        Object.assign(this.externalRecord, this.initExternal)
        Object.assign(this.internalRecord, this.initInternal)
        this.timer = setTimeout(() => {
          this.disabled = true
        }, 500)
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss">
.settings {
  .app-wrapper {
    .settings-type {
      text-align: center;
      margin-top: -35px;
    }

    .settings-form {
      margin-top: 40px;
      .form-item-desc {
        min-height: 50px;
        font-size: 13px;
        color: #676767;
      }

      .settings-input {
        width: 60%;
      }

      .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
      .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
        color: transparent;
      }
    }

    .button-group_center {
      margin-top: 20px;
    }

    .el-select.emq-select {
      width: 60%;
    }
  }
}
</style>
