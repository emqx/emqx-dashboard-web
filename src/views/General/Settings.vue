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
import { loadConfig, updateConfig } from '../../api/settings'
import ExternalForm from './components/ExternalForm'
import InternalForm from './components/InternalForm'

export default {
  name: 'Settings',

  components: {
    ExternalForm,
    InternalForm,
  },

  props: {},

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
      saveLoading: false,
      externalRecord: {},
      internalRecord: {},
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

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const { externalRes, internalRes } = await loadConfig()
      if (externalRes && internalRes) {
        this.externalRecord = externalRes
        this.internalRecord = internalRes
      }
    },
    async handleUpdate(type, data) {
      this.saveLoading = true
      const res = await updateConfig(type, data)
      if (res) {
        this.$message.success(this.$t('Base.saveSuccess'))
      }
      this.saveLoading = false
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
