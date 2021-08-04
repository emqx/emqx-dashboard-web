<template>
  <el-pagination
    v-if="count > 0"
    layout="total, sizes, prev, pager, next"
    :page-sizes="[20, 50, 100, 500]"
    :page-size.sync="limit"
    :current-page.sync="page"
    :total="count"
    @size-change="
      () => {
        reloadFunc({ page: 1, limit: limit })
      }
    "
    @current-change="
      () => {
        reloadFunc({ page: page, limit: limit })
      }
    "
  >
  </el-pagination>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  props: {
    count: Number,
    reloadFunc: Function,
  },
  data: function () {
    return {
      page: 1,
      limit: 20,
    }
  },
  setup(prop) {
    onMounted(() => {
      prop.reloadFunc({ page: 1, limit: 20 })
    })
  },
})
</script>
<style lang="sass" scoped>
</style>
