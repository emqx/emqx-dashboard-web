<template>
  <div ref="chart" class="connection-statistics"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import resizeChart from '@/mixins/resizeChart'

const dataItemToHTML = (name, data, marker) => {
  return `<div class="tooltip-item">
        <div>
          ${marker}
          <span>${name}</span>
        </div>
        <span>${data}</span>
        </div>`
}

const echartOption = {
  grid: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'transparent',
    textStyle: {
      color: '#fff',
    },
    padding: 10,
    formatter(arr) {
      return arr
        .reverse()
        .map(({ seriesName, data, marker }) => dataItemToHTML(seriesName, data, marker))
        .join('')
    },
  },
  xAxis: {
    type: 'value',
    max: 1000,
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    data: [''],
    boundaryGap: false,
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  series: [],
}

export default {
  name: 'ConnectionStatistics',

  mixins: [resizeChart],

  props: {
    maxConnections: {
      type: Number,
      required: true,
    },
    /**
     * { connection: number; live_connection: number; }
     */
    connectionData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      chart: null,
      echartOption,
    }
  },

  watch: {
    maxConnections() {
      this.setXAxisMaxValue()
      this.setSeries()
    },
    connectionData: {
      deep: true,
      handler: 'setSeries',
    },
    // eslint-disable-next-line
    '$store.state.leftBarCollapse': function () {
      setTimeout(this.chart.resize, 500)
    },
  },

  mounted() {
    this.initEcharts()
    this.setXAxisMaxValue()
    this.setSeries()
  },

  methods: {
    initEcharts() {
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(this.echartOption)
    },

    createSeries() {
      return [
        {
          type: 'bar',
          name: this.$t('Overview.limit'),
          data: [this.maxConnections],
          itemStyle: {
            color: '#ebeef4',
          },
        },
        {
          type: 'bar',
          name: this.$t('Overview.all'),
          data: [this.connectionData.connection],
          itemStyle: {
            color: '#70d4b6',
          },
          barMinHeight: 6,
        },
        {
          type: 'bar',
          name: this.$t('Overview.active'),
          data: [this.connectionData.live_connection],
          itemStyle: {
            color: '#00aa5b',
          },
          barMinHeight: 6,
          barGap: '-100%',
          barCategoryGap: '0%',
        },
      ]
    },

    setXAxisMaxValue() {
      if (!(this.chart && this.chart.setOption)) {
        return
      }
      this.chart.setOption({
        xAxis: { max: this.maxConnections },
      })
    },

    setSeries() {
      if (!(this.chart && this.chart.setOption)) {
        return
      }
      this.chart.setOption({
        series: this.createSeries(),
      })
    },
  },
}
</script>

<style lang="scss">
.tooltip-item {
  width: 160px;
  display: flex;
  justify-content: space-between;
}
</style>
