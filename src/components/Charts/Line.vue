<template>
  <div ref="chart" class="line-chart"></div>
</template>


<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'

export default {
  name: 'LineChart',

  props: {
    // Y-coordinate title
    yTitle: {
      type: Array,
      default: () => [''],
    },
    // Chart line color
    chartColor: {
      type: Array,
      default: () => ['#23c88e'],
    },
    axisColor: {
      type: Object,
      default: () => ({}),
    },
    // Chart data
    chartData: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      seriesConfig: [],
      chart: undefined,
    }
  },

  computed: {
    rawData() {
      // [[t, v], [t, v]]
      return this.chartData.map(($) => {
        const [k, v] = $
        return { }
      })
    },
  },

  watch: {
    chartData: {
      deep: true,
      handler: 'drawChart',
    },
  },

  mounted() {
    this.drawChart()
  },

  methods: {
    setSeriesConfig() {
      this.seriesConfig = []
      for (let i = 0; i < this.yTitle.length; i += 1) {
        this.seriesConfig.push({
          name: this.yTitle[i],
          type: 'line',
          symbolSize: 5,
          showSymbol: true,
          data: this.chartData[i].yData,
          smooth: true,
          step: '',
          lineStyle: {
            normal: {
              shadowColor: '#34c388',
              width: 2,
              shadowBlur: 8,
              shadowOffsetY: 10,
            },
          },
        })
      }
    },

    drawChart() {
      this.setSeriesConfig()
      this.chart = echarts.init(this.$refs.chart)
      const option = {
        color: this.chartColor,
        tooltip: {
          trigger: 'axis',
          confine: true,
        },
        grid: {
          left: '2%',
          right: '2%',
          top: '3%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartData[0].xData,
          axisLine: {
            lineStyle: {
              color: this.axisColor.colorAxisLine,
            },
          },
          axisLabel: {
            textStyle: {
              color: this.axisColor.colorAxisLabel,
            },
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: this.axisColor.colorAxisLine,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: this.axisColor.colorSplitLine,
            },
          },
          axisLabel: {
            textStyle: {
              color: this.axisColor.colorAxisLabel,
            },
          },
        },
        series: this.seriesConfig,
      }
      this.chart.setOption(option)
    },
    // Redraw the echarts charts
    reDrawEchart() {
      // Destroy
      this.chart.dispose()
      // Redraw the chart
      this.chart = undefined
      this.drawChart()
    },
  },
}
</script>
