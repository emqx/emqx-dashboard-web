<template>
  <div class="not-found">
    <h1>404</h1>
    <p>{{ $t('Base.resourcesNotFound') }}</p>
  </div>
</template>


<script>
export default {
  name: 'NotFound',

  components: {},

  props: {},

  data() {
    return {}
  },

  created() {},

  methods: {},
}
</script>


<style lang="scss" scoped>
.not-found {
  text-align: center;
  margin-top: 40px;
}
</style>
