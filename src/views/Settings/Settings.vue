<template>
  <div class="settings">
    <div class="app-wrapper">
      <el-tabs v-model="activeName" type="card" :before-leave="handleBeforeLeave">
        <el-tab-pane :label="$t('Settings.basic')" name="baseSettings">
          <base-settings v-if="activeName === 'baseSettings'" ref="baseSettings"></base-settings>
        </el-tab-pane>
        <el-tab-pane label="Zone" name="zoneSettings">
          <zone-settings v-if="activeName === 'zoneSettings'" ref="zoneSettings"></zone-settings>
        </el-tab-pane>
        <el-tab-pane :label="$t('Settings.listeners')" name="listenerSettings">
          <listener-settings v-if="activeName === 'listenerSettings'" ref="listenerSettings"></listener-settings>
        </el-tab-pane>
        <el-tab-pane :label="$t('Settings.monitorAlarm')" name="monitorSettings">
          <monitor-settings v-if="activeName === 'monitorSettings'" ref="monitorSettings"></monitor-settings>
        </el-tab-pane>
        <el-tab-pane :label="$t('Settings.cluster')" name="clusterSettings">
          <cluster-settings v-if="activeName === 'clusterSettings'" ref="clusterSettings"></cluster-settings>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import BaseSettings from './BaseSettings'
import ZoneSettings from './ZoneSettings'
import ClusterSettings from './ClusterSettings'
import ListenerSettings from './ListenerSettings'
import MonitorSettings from './MonitorSettings'

export default {
  name: 'Settings',

  components: {
    BaseSettings,
    ZoneSettings,
    ClusterSettings,
    ListenerSettings,
    MonitorSettings,
  },

  data() {
    return {
      activeName: 'baseSettings',
    }
  },

  methods: {
    async handleBeforeLeave(currentName, oldName) {
      if (oldName !== 'clusterSettings' && currentName !== oldName) {
        // 设置是否修改过
        const { disabled } = this.$refs[oldName]._data
        if (!disabled) {
          const status = await this.$confirm(this.$t('Settings.noSaveConfirm'), this.$t('Base.warning'), {
            type: 'warning',
            cancelButtonText: this.$t('Settings.no'),
          })
          if (status === 'confirm') {
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
