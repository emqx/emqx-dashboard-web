<template>
  <el-dialog
    :width="`${licenseTipWidth}px`"
    :visible.sync="licenseTipVisible"
    :close-on-click-modal="false"
    custom-class="license-dialog"
    top="0"
  >
    <div class="tip-content">
      <p v-if="!isLicenseExpiry" v-html="$t('Overview.licenseEvaluationTip')"></p>
      <p v-else v-html="$t('Overview.licenseExpiryTip')"></p>
    </div>
    <div v-if="!isLicenseExpiry" class="tip-checkbox">
      <el-checkbox v-model="noPromptAnyMore" @change="liceEvaTipShowChange">
        {{ $t('Overview.notPromptAgain') }}
      </el-checkbox>
    </div>
    <div class="tip-button">
      <el-button type="primary" size="small" @click="licenseTipVisible = false">
        {{ $t('Overview.konw') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
  },

  data() {
    return {
      noPromptAnyMore: false,
    }
  },

  computed: {
    licenseTipVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    isLicenseExpiry() {
      return this.$store.state.license.expiry
    },
    licenseTipWidth() {
      return this.isLicenseExpiry ? 600 : 520
    },
    license() {
      return this.$store.state.license
    },
  },

  methods: {
    liceEvaTipShowChange(val) {
      if (val) {
        localStorage.setItem('licenseTipVisible', false)
      }
    },
  },
}
</script>

<style lang="scss">
.license-dialog {
  top: 50%;
  transform: translateY(-50%);
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding-bottom: 20px;
  }

  .tip-title {
    font-size: 18px;
    .el-icon-warning {
      color: #e6a23c;
    }
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }

  .tip-content {
    font-size: 16px;
    p {
      word-break: break-word;
    }
  }

  .tip-checkbox {
    margin-top: 10px;
    .el-checkbox {
      color: #aaa;
    }
  }

  .tip-button {
    text-align: right;
  }
}
</style>
