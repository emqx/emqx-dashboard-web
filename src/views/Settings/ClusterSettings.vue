<template>
  <a-card
    class="cluster-settings emq-list-card"
  >
    Cluster
  </a-card>
</template>


<script>
import { loadCluster, loadNodes } from '../../api/cluster'

export default {
  name: 'ClusterSettings',

  components: {
  },

  data() {
    return {
      record: {},
      currentNodes: [],
    }
  },

  created() {
    this.getNodes()
    this.getCluster()
  },

  methods: {
    async getCluster() {
      const res = await loadCluster()
      console.log(res)
    },
    async getNodes() {
      this.currentNodes = await loadNodes()
      console.log(this.currentNodes)
    },
  },
}
</script>
