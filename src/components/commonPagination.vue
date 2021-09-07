<template>
  <el-pagination
    v-if="count > 0"
    layout="total, sizes, prev, pager, next"
    :page-sizes="[20, 50, 100, 500]"
    :page-size.sync="limit"
    :current-page.sync="page"
    :total="count"
    @size-change="reconstructReloadFunc(1)"
    @current-change="reconstructReloadFunc(page)"
  >
  </el-pagination>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    reloadFunc: Function,
  },
  created: function () {
    this.$on('loadPage', this.reconstructReloadFunc)
  },
  setup(prop) {
    let page = ref(1)
    let limit = ref(20)
    let count = ref(0)

    const reconstructReloadFunc = async (p) => {
      let meta = await prop.reloadFunc({ page: p ?? page.value, limit: limit.value })
      count.value = meta?.count
    }

    return {
      page,
      limit,
      count,
      reconstructReloadFunc,
    }
  },
})
</script>
