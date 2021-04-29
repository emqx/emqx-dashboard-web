<template>
  <div class="plugin-manage">
    <template v-if="pluginName === 'emqx_auth_clientid'">
      <auth-clientId-table></auth-clientId-table>
    </template>
    <template v-if="pluginName === 'emqx_auth_username'">
      <auth-username-table></auth-username-table>
    </template>
    <template v-if="pluginName === 'emqx_auth_mnesia'">
      <auth-mnesia-table></auth-mnesia-table>
    </template>
    <template v-if="pluginName === 'emqx_auth_jwt'">
      <generate-JWT></generate-JWT>
    </template>
  </div>
</template>

<script>
import AuthClientIdTable from './components/AuthClientIdTable.vue'
import AuthUsernameTable from './components/AuthUsernameTable.vue'
import AuthMnesiaTable from './components/AuthMnesiaTable.vue'
import GenerateJWT from './components/GenerateJWT.vue'

export default {
  name: 'PluginsManage',

  components: {
    AuthClientIdTable,
    AuthUsernameTable,
    AuthMnesiaTable,
    GenerateJWT,
  },

  data() {
    return {
      pluginName: this.$route.params.pluginName || 'emqx_auth_mnesia',
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.pluginName === 'emqx_auth_jwt') {
      this.$confirm(
        this.$t('Plugins.leaveTokenPage'),
        this.$t('Base.warning'),
        {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        },
      )
        .then(() => {
          next()
        })
        .catch(() => {})
    } else {
      next()
    }
  },
}
</script>

<style lang="scss"></style>
