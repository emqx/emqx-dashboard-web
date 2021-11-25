<template>
  <div :id="chartId" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

import resizeChart from '@/mixins/resizeChart'

const DEFAULT_CHART_HEIGHT = '190px'

export default {
  name: 'PolylineChart',

  mixins: [resizeChart],

  props: {
    chartId: {
      type: String,
      required: true,
    },
    yTitle: {
      type: Array,
      default: () => [''],
    },
    chartColors: {
      type: Array,
      default: () => [],
    },
    axisColor: {
      type: Object,
      default: () => ({
        colorAxisLine: '#757575',
        colorAxisLabel: '#757575',
      }),
    },
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
      default: DEFAULT_CHART_HEIGHT,
    },
    gridRight: {
      type: String,
      default: '5%',
    },
    gridLeft: {
      type: String,
      default: '2%',
    },
    legendBottom: {
      type: String,
      default: '-5px',
    },
  },

  data() {
    return {
      seriesConfig: [],
      chart: undefined,
    }
  },

  computed: {
    isSmallChart() {
      return !(this.height !== DEFAULT_CHART_HEIGHT && parseInt(this.height, 10) > 300)
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
          smooth: true,
          symbolSize: 5,
          showSymbol: false,
          data: this.chartData[i].yData,
          step: false,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: i % 6 === 0 && i !== 0 ? this.chartColors[6] : this.chartColors[i % 6],
              },
              {
                offset: 1,
                color: '#fff',
              },
            ]),
            opacity: 0.2,
          },
        })
      }
    },
    handleTextWithWrap(text, wrapLength = 40) {
      return text.replace(new RegExp(`.{${wrapLength}}`, 'g'), (matched) => `${matched}<br />`)
    },
    ellipsisText(str, length) {
      return echarts.format.truncateText(str, length, '14px Microsoft Yahei', '…')
    },
    dataItemToHTML(name, data, marker) {
      return `<div class="polyline-chart-tooltip-item ${this.isSmallChart ? 'is-short' : 'is-long'}">
        <div>
          ${marker}
          <span class="series-name">${this.handleTextWithWrap(name)}</span>
        </div>
        <span>${data}</span>
        </div>`
    },
    drawChart() {
      this.setSeriesConfig()
      this.chart = echarts.init(document.getElementById(this.chartId))
      const _this = this
      const option = {
        legend: {
          bottom: this.legendBottom,
          data: this.yTitle,
          icon: 'circle',
          itemWidth: 8,
          formatter(name) {
            return _this.isSmallChart ? '' : _this.ellipsisText(name, 600)
          },
          tooltip: {
            show: true,
            formatter({ name }) {
              return _this.handleTextWithWrap(name, _this.isSmallChart ? 40 : 120)
            },
          },
        },
        color: this.chartColors,
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter(arr) {
            return arr
              .map(({ seriesName, data, marker }) => {
                const name = _this.isSmallChart ? _this.ellipsisText(seriesName, 100) : seriesName
                return _this.dataItemToHTML(name, data, marker)
              })
              .join('')
          },
        },
        grid: {
          left: this.gridLeft,
          right: this.gridRight,
          top: '3%',
          bottom: '12%',
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
            show: false,
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
    reDrawEchart() {
      this.chart.dispose()
      this.chart = undefined
      this.drawChart()
    },
  },
}
</script>

<style lang="scss">
.polyline-chart-tooltip-item {
  display: flex;
  justify-content: space-between;
  &.is-shorter {
    width: 160px;
  }
  &.is-long {
    width: 360px;
  }
  .series-name {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
