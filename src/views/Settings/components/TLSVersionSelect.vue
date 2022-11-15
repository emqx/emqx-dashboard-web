<template>
  <el-select class="SSL-version-select" v-model="selected" multiple>
    <el-option v-for="item in versionOptions" :key="item" :value="item" :label="item" />
  </el-select>
</template>

<script>
const CONNECTOR = ','

export default {
  props: {
    value: {
      type: String,
    },
  },

  data() {
    const versionOptions = ['tlsv1.3', 'tlsv1.2', 'tlsv1.1', 'tlsv1']

    return {
      versionOptions,
    }
  },

  computed: {
    selected: {
      get() {
        try {
          return this.value.split(CONNECTOR).filter((item) => this.versionOptions.includes(item))
        } catch (error) {
          return []
        }
      },
      set(val) {
        const str = val.join(CONNECTOR)
        this.$emit('input', str)
      },
    },
  },
}
</script>

<style lang="scss">
.SSL-version-select {
  width: 100%;
}
</style>
