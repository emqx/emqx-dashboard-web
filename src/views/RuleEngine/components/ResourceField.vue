<template>
  <el-row :gutter="40" class="resource-field">
    <ul class="field-info">
      <el-col v-for="(item, i) in config" :key="i" :span="12">
        <li class="field-info-item" :title="item.description">
          <div class="field-title">{{ item.title }}:</div>
          <span class="field-value">{{ item.value | itemValue }}</span>
        </li>
      </el-col>
    </ul>
  </el-row>
</template>

<script>
export default {
  name: 'ResourceField',

  components: {},

  filters: {
    itemValue(val) {
      if (typeof val === 'object') {
        return JSON.stringify(val)
      }
      return val
    },
  },

  props: {
    config: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {}
  },

  created() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.field-title {
  width: 140px !important;
}
</style>
