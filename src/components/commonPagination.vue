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
import { defineComponent, onMounted, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    count: Number,
    reloadFunc: Function,
  },
  setup(prop) {
    let page = ref(1)
    let limit = ref(20)
    onMounted(() => {
      prop.reloadFunc({ page: page.value, limit: limit.value })
    })

    return {
        page,
        limit,
    }
  },
})
</script>
<style lang="sass" scoped>
</style>
