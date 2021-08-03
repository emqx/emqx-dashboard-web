<template>
  <div id="nodes-graph"></div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from '@vue/composition-api'
import * as ddd from 'd3'
import { loadNodes, loadStats } from '@/api/common'

export default defineComponent({
  name: 'NodesGraph',
  setup() {
    let nodes = ref([])

    let getNodes = async () => {
      nodes.value = await loadNodes()
    }
    onMounted(() => {
      getNodes()
      let svg = ddd.select
      console.log(nodes)
    })
  },
})
</script>

<style lang="scss" scoped>
</style>