<template>
  <div class="settings">
    <div class="app-wrapper">
      <el-tabs
        v-model="activeName"
        type="card"
        :before-leave="handleBeforeLeave"
      >
        <el-tab-pane :label="$t('Settings.basic')" name="basic">
          <config-settings v-if="activeName === 'basic'" ref="basicConfig"></config-settings>
        </el-tab-pane>

        <el-tab-pane :label="$t('Settings.cluster')" name="cluster">
          <cluster-settings v-if="activeName === 'cluster'" ref="clusterSettings"></cluster-settings>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>


<script>
import ConfigSettings from './ConfigSettings'
import ClusterSettings from './ClusterSettings'

export default {
  name: 'Settings',

  components: {
    ConfigSettings,
    ClusterSettings,
  },

  data() {
    return {
      activeName: 'basic',
    }
  },

  methods: {
    async handleBeforeLeave(currentName, oldName) {
      if (currentName !== 'basic' && oldName === 'basic') {
        // 基础设置是否修改过
        const { basicConfig } = this.$refs
        const { disabled } = basicConfig._data
        if (!disabled) {
          const status = await this.$confirm(
            this.$t('Settings.noSaveConfirm'),
            this.$t('Base.warning'),
            {
              type: 'warning',
              cancelButtonText: this.$t('Settings.no'),
            },
          )
          if (status === 'confirm') {
            basicConfig.cancel(false)
            return true
          }
          return false
        }
      }
      return true
    },
  },
}
</script>


<style lang="scss">
.settings {
  .el-form {
    margin-top: 32px;

    .el-input.is-disabled .el-input__inner {
      color: #676767;
    }

    .el-col {
      min-height: 60px;
      display: flex;
      align-items: center;
    }

    .el-form-item {
      margin-bottom: 0px;
      flex: 1;
    }

    .form-item-desc {
      font-size: 13px;
      color: #676767;
      flex: 1;
    }

    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
      color: transparent;
    }
  }

  .button-group__center {
    margin-top: 20px;
  }
}
</style>
