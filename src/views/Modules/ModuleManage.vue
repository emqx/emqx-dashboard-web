<template>
  <div class="module-manage">
    <div class="app-wrapper">
      <auth-mnesia v-if="type === 'mnesia_authentication'"></auth-mnesia>
      <jwt-authentication v-else-if="type === 'jwt_authentication'"></jwt-authentication>
    </div>
  </div>
</template>

<script>
import AuthMnesia from './components/AuthMnesia/AuthMnesia'
import jwtAuthentication from './components/jwtAuthentication/jwtAuthentication'

export default {
  name: 'ModuleManage',

  components: {
    AuthMnesia,
    jwtAuthentication,
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
