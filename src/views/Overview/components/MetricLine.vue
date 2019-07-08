<template>
  <div class="metric-line">
    <ve-line
      v-bind="$attrs"
      :data="chartData"
      :settings="chartSettings"
    ></ve-line>
  </div>
</template>


<script>
import VeLine from 'v-charts/lib/line.common'

export default {
  name: 'MetricLine',

  components: {
    [VeLine.name]: VeLine,
  },
  inheritAttrs: false,

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      chartSettings: {
      },
      chartData: {
        columns: ['k'],
        rows: [],
      },
    }
  },

  watch: {
    value: {
      deep: true,
      handler() {
        this.setData()
      },
    },
  },

  created() {
    this.setData()
  },

  methods: {
    setData() {
      const data = { ...this.value }
      data.data = data.data || []
      data.nodes = data.nodes || []
      this.chartData.rows = data.data
      this.chartData.columns = ['k', ...data.nodes]
    },
  },
}
</script>


<style lang="scss">
.metric-line {
}
</style>
