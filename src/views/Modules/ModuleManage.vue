<template>
  <div class="module-manage">
    <div :class="{ 'app-wrapper': type !== 'topic_metrics' }">
      <auth-mnesia v-if="type === 'mnesia_authentication'"></auth-mnesia>
      <jwt-authentication v-else-if="type === 'jwt_authentication'"></jwt-authentication>
      <auth-sasl v-else-if="type === 'auth_sasl'"></auth-sasl>
      <lw-clients v-else-if="type === 'lwm2m_protocol'"></lw-clients>
      <topic-metrics v-else-if="type === 'topic_metrics'"></topic-metrics>
    </div>
  </div>
</template>

<script>
import AuthMnesia from './components/AuthMnesia/AuthMnesia'
import JwtAuthentication from './components/JwtAuthentication/JwtAuthentication'
import AuthSasl from './components/AuthSasl/AuthSasl'
import LwClients from './components/Lwm2mProtocol/LwClients'
import TopicMetrics from './components/TopicMetrics/TopicMetrics'

export default {
  name: 'ModuleManage',

  components: {
    AuthMnesia,
    JwtAuthentication,
    AuthSasl,
    LwClients,
    TopicMetrics,
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
