<template>
  <div :id="chartId" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/legend'

import resizeChart from '@/mixins/resizeChart'

export default {
  name: 'MetricLine',

  mixins: [resizeChart],

  props: {
    // DOM container id
    chartId: {
      type: String,
      required: true,
    },
    // Whether it is a smooth graph
    smooth: {
      type: [Boolean, Number],
      default: false,
    },
    // Whether to display value points
    showSymbol: {
      type: Boolean,
      default: false,
    },
    // Whether it is a ladder diagram and ladder diagram type
    stepType: {
      type: String,
      default: '',
    },
    // Y-coordinate title
    yTitle: {
      type: Array,
      default: () => [''],
    },
    // Chart line color
    chartColor: {
      type: Array,
      default: () => [
        '#2CD3AE',
        '#98DFF3',
        '#6D7DA3',
        '#53A5F7',
        '#F2AF3D',
        '#34C388',
        '#2DC8B2',
        '#AA86E6',
        '#7C7BE2',
        '#83A9FD',
      ],
    },
    axisColor: {
      type: Object,
      default: () => ({
        colorAxisLine: '#606266',
        colorAxisLabel: '#606266',
        colorSplitLine: '#EBEEF5',
      }),
    },
    // Chart data
    chartData: {
      type: Array,
      default: () => [
        {
          xData: [],
          yData: [],
        },
      ],
    },
    height: {
      type: String,
      default: '300px',
    },
    tooltipFormatter: {
      type: Function,
      default: null,
    },
    yAxisFormatter: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      seriesConfig: [],
      chart: undefined,
    }
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
          showSymbol: this.showSymbol,
          data: this.chartData[i].yData,
          smooth: this.smooth,
          step: this.stepType,
          lineStyle: {
            normal: {
              width: 2,
            },
          },
          markLine: {
            data: this.markLineData,
          },
        })
      }
    },
    drawChart() {
      this.setSeriesConfig()
      this.chart = echarts.init(document.getElementById(this.chartId))
      const option = {
        legend: {
          bottom: '0px',
          data: this.yTitle,
          icon: 'circle',
        },
        color: this.chartColor,
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: this.tooltipFormatter,
        },
        grid: {
          left: '2%',
          right: '2%',
          top: '3%',
          bottom: '10%',
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
            showMinLabel: false,
            textStyle: {
              color: this.axisColor.colorAxisLabel,
            },
          },
        },
        yAxis: {
          type: 'value',
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
            formatter: this.yAxisFormatter,
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
