<template>
  <div :id="chartId" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

import resizeChart from '@/mixins/resizeChart'

export default {
  name: 'DoughnutChart',

  mixins: [resizeChart],

  props: {
    chartId: {
      type: String,
      required: true,
    },
    cardTitle: {
      type: String,
      default: '',
    },
    legendData: {
      type: Array,
      default: () => [],
    },
    seriesData: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: '230px',
    },
  },

  data() {
    return {
      chart: undefined,
    }
  },

  watch: {
    seriesData: {
      deep: true,
      handler: 'drawChart',
    },
  },

  mounted() {
    this.drawChart()
  },

  methods: {
    drawChart() {
      let Dom = document.getElementById(this.chartId)
      if (!Dom) return
      echarts.dispose(Dom)
      this.chart = echarts.init(Dom)
      const option = {
        title: {
          text: this.cardTitle,
          // textStyle: {
          fontSize: 16,
          // },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          itemWidth: 10,
          itemGap: 16,
          // textStyle: {
          color: '#757575',
          // },
          bottom: 0,
          icon: 'circle',
          data: this.legendData,
        },
        series: [
          {
            name: this.cardTitle,
            type: 'pie',
            radius: ['45%', '55%'],
            avoidLabelOverlap: false,
            hoverOffset: 3,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.seriesData,
          },
        ],
      }
      this.chart.setOption(option)
    },
    reDrawEchart() {
      this.chart.dispose()
      this.chart = undefined
      this.drawChart()
    },
  },
}
</script>
