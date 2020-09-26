<template>
  <div class="module-manage">
    <div class="app-wrapper">
      <auth-mnesia v-if="type === 'mnesia_authentication'"></auth-mnesia>
    </div>
  </div>
</template>

<script>
import AuthMnesia from './components/AuthMnesia/AuthMnesia'

export default {
  name: 'ModuleManage',

  components: {
    AuthMnesia,
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
