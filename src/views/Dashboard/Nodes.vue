<template>
  <div class="nodes app-wrapper">
    <div class="section-header">{{ tl('nodeData') }}</div>
  </div>
</template>
<script>
export default {
  name: 'Nodes',
  methods: {
    tl(key, collection = 'Dashboard') {
      return this.$t(collection + '.' + key)
    },
  },
}
</script>
<style scoped></style>
