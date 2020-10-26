<template>
  <div class="module-manage">
    <div class="app-wrapper">
      <auth-mnesia v-if="type === 'mnesia_authentication'"></auth-mnesia>
      <jwt-authentication v-else-if="type === 'jwt_authentication'"></jwt-authentication>
      <auth-sasl v-else-if="type === 'auth_sasl'"></auth-sasl>
    </div>
  </div>
</template>

<script>
import AuthMnesia from './components/AuthMnesia/AuthMnesia'
import JwtAuthentication from './components/JwtAuthentication/JwtAuthentication'
import AuthSasl from './components/AuthSasl/AuthSasl'

export default {
  name: 'ModuleManage',

  components: {
    AuthMnesia,
    JwtAuthentication,
    AuthSasl,
  },

  data() {
    return {}
  },

  computed: {
    type() {
      return this.$route.query.type
    },
  },
}
</script>
