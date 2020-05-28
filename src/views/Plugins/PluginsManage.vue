<template>
  <div class="plugin-manage">
    <template v-if="pluginName === 'emqx_auth_clientid'">
      <auth-clientId-table></auth-clientId-table>
    </template>
    <template v-if="pluginName === 'emqx_auth_username'">
      <auth-username-table></auth-username-table>
    </template>
  </div>
</template>


<script>
import AuthClientIdTable from './components/AuthClientIdTable.vue'
import AuthUsernameTable from './components/AuthUsernameTable.vue'

export default {
  name: 'PluginsManage',

  components: {
    AuthClientIdTable,
    AuthUsernameTable,
  },

  data() {
    return {
      pluginName: this.$route.params.pluginName,
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.pluginName === 'emqx_auth_jwt') {
      this.$confirm(this.$t('Plugins.leaveTokenPage'), this.$t('Base.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      }).then(() => {
        next()
      }).catch(() => {
      })
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
</style>
