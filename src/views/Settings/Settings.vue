<template>
  <div class="settings">
    <page-header
      :back-title="$t('Settings.setting')"
    >
    </page-header>

    <div class="app-wrapper">
      <el-tabs
        v-model="activeName"
        type="card"
        :before-leave="handleBeforeLeave"
      >
        <el-tab-pane :label="$t('Settings.basic')" name="basic">
          <basic-config ref="basicConfig"></basic-config>
        </el-tab-pane>

        <el-tab-pane :label="$t('Settings.cluster')" name="cluster">
          <cluster-settings ref="clusterSettings"></cluster-settings>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>


<script>
import BasicConfig from './BasicConfig'
import ClusterSettings from './ClusterSettings'

export default {
  name: 'Settings',

  components: {
    BasicConfig,
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
