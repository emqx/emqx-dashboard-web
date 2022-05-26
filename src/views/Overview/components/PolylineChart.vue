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
import 'echarts/lib/component/legendScroll'

import moment from 'moment'

import resizeChart from '@/mixins/resizeChart'

const DEFAULT_CHART_HEIGHT = '190px'

const formatTime = (time) => moment(time).utcOffset(0).format('HH:mm')
const createArrFromTimeRange = (earliest, latest) => {
  const STEP = 1000 * 60
  const ret = []
  const stepCount = Math.floor((latest - earliest) / STEP)
  for (let i = 0; i < stepCount; i += 1) {
    ret.push(formatTime(earliest + i * STEP))
  }
  return ret
}

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
      /**
       * @type Array<string>
       */
      xAxisData: [],
      /**
       * @type Array<Array<number>>
       */
      yAxisData: [],
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
          data: this.yAxisData[i],
          step: false,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: i % 6 === 0 && i !== 0 ? this.chartColors[5] : this.chartColors[i % 6],
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
    countXAxisData() {
      const totalXData = this.chartData.reduce((arr, { xData }) => arr.concat(xData), [])
      const theEarliest = Math.min(...totalXData)
      const theLatest = Math.max(...totalXData)
      this.xAxisData = createArrFromTimeRange(theEarliest, theLatest)
    },
    countYAxisData() {
      this.yAxisData = []
      this.chartData.forEach(({ xData, yData }) => {
        const currentMap = new Map()
        const currentYAxisData = []
        xData.forEach((timeStamp, index) => {
          currentMap.set(formatTime(timeStamp), yData[index])
        })
        this.xAxisData.forEach((time) => {
          currentYAxisData.push(currentMap.get(time))
        })
        this.yAxisData.push(currentYAxisData)
      })
    },
    drawChart() {
      /*
        1. Find the earliest time among all the data
        2. Find the latest time among all the data
        3. Generate a map from the data of each node
          - key is the formatted time
          - value is value
        4. Generate X-axis data according to the earliest time and latest time
        5. Then find the value of each node at that time according to each tick time on the X axis, and fill in 0 when it is not found
      */
      this.countXAxisData()
      this.countYAxisData()
      this.setSeriesConfig()
      this.chart = echarts.init(document.getElementById(this.chartId))
      const _this = this
      const option = {
        legend: {
          type: 'scroll',
          bottom: this.legendBottom,
          data: this.yTitle,
          icon: 'circle',
          itemWidth: 8,
          padding: [5, 50, 5, 5],
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
          appendToBody: true,
          formatter(arr) {
            return arr
              .filter(({ data }) => data !== undefined)
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
          data: this.xAxisData,
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
.tooltip-title {
  line-height: 1.5;
  font-size: 14px;
  margin-bottom: 6px;
}
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
