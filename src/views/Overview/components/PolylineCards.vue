<template>
  <div class="polyline-cards">
    <el-collapse-transition v-if="bigChartItem.text">
      <div class="big-chart">
        <a-card class="big-card">
          <div class="card-title">{{ bigChartItem.text }}</div>
          <span class="shrink-icon" @click="bigChartItem = {}"></span>
          <polyline-chart
            ref="bigChart"
            chart-id="big-polyline"
            :y-title="metricTitles"
            :chart-data="metricLog[bigChartItem.value]"
            :chartColors="chartColorList[bigChartItem.value]"
            height="420px"
            gridRight="1.5%"
            gridLeft="1%"
            legendBottom="10px"
          ></polyline-chart>
        </a-card>
      </div>
    </el-collapse-transition>
    <el-row :gutter="20">
      <div v-for="item in dataTypeFilter" :key="item.value">
        <template v-if="item !== bigChartItem">
          <el-col :span="8">
            <a-card class="polyline-card" :loading="isLoading">
              <div class="card-title">{{ item.text }}</div>
              <span class="enlarge-icon" @click="bigChartItem = item"></span>
              <polyline-chart
                :chart-id="`${item.value}-polyline`"
                :y-title="metricTitles"
                :chart-data="metricLog[item.value]"
                :chartColors="chartColorList[item.value]"
              ></polyline-chart>
            </a-card>
          </el-col>
        </template>
      </div>
    </el-row>
  </div>
</template>

<script>
import Moment from 'moment'
import PolylineChart from './PolylineChart'
import { loadMetricsLog } from '@/api/overview'

export default {
  name: 'PolylineCards',

  components: {
    PolylineChart,
  },

  data() {
    const totalColors = ['#22BB7A', '#4065E0', '#EEC90D', '#07E3E4', '#6ECAFA', '#AF79FF']

    return {
      dataTypeMap: {
        dropped: this.$t('Overview.messageDrop'),
        connection: this.$t('Overview.connection'),
        route: this.$t('Overview.topics'),
        subscriptions: this.$t('Overview.Subscription'),
        sent: this.$t('Overview.messageOut'),
        received: this.$t('Overview.messageIn'),
      },
      metricTitles: [],
      metricLog: {
        dropped: this.chartDataFill(32),
        connection: this.chartDataFill(32),
        route: this.chartDataFill(32),
        subscriptions: this.chartDataFill(32),
        sent: this.chartDataFill(32),
        received: this.chartDataFill(32),
      },
      dataTypeList: ['dropped', 'connection', 'route', 'subscriptions', 'sent', 'received'],
      timerMetrics: null,
      bigChartItem: {},
      chartColorList: {
        dropped: totalColors,
        connection: totalColors,
        route: totalColors,
        subscriptions: totalColors,
        sent: totalColors,
        received: totalColors,
      },
      isLoading: false,
    }
  },

  computed: {
    dataTypeFilter() {
      return Object.entries(this.dataTypeMap).map(([value, text]) => ({ text, value }))
    },
  },

  created() {
    this.loadMetricsLogData()
  },

  beforeDestroy() {
    this.clearTimer()
  },

  methods: {
    chartDataFill(length) {
      return Array.from({ length }, () => ({ xData: [], yData: [] }))
    },
    _formatTime(time) {
      return Moment(time).utcOffset(0).format('HH:mm')
    },
    async loadMetricsLogData() {
      try {
        this.isLoading = true
        await Promise.all(
          this.dataTypeList.map(async (typeName) => {
            try {
              const data = await loadMetricsLog(false, typeName)
              this.metricTitles = Object.keys(data)
              this.metricLog[typeName] = this.chartDataFill(this.metricTitles.length)
              const currentData = this.metricLog[typeName]
              this.metricTitles.forEach((key, index) => {
                data[key].forEach((item) => {
                  currentData[index].xData.push(item[0])
                  currentData[index].yData.push(item[1])
                })
              })
              return Promise.resolve()
            } catch (error) {
              return Promise.resolve()
            }
          }),
        )
        this.isLoading = false
        this.timerMetrics = setInterval(this.setMetricsChartRealTime, 60000)
      } catch (e) {
        console.error(e)
        this.isLoading = false
      }
    },
    setMetricsChartRealTime() {
      this.dataTypeList.forEach(async (typeName) => {
        const data = await loadMetricsLog(false, typeName)
        const currentData = this.metricLog[typeName]
        this.metricTitles.forEach((key, index) => {
          let nodeMetric = data[key]
          if (nodeMetric.length > 120) {
            nodeMetric = nodeMetric.slice(-120)
          }
          currentData[index].xData = []
          currentData[index].yData = []
          nodeMetric.forEach(([x, y]) => {
            currentData[index].xData.push(x)
            currentData[index].yData.push(y)
          })
        })
      })
    },
    clearTimer() {
      if (this.timerMetrics) {
        clearInterval(this.timerMetrics)
        this.timerMetrics = null
      }
    },
  },
}
</script>

<style lang="scss">
@import '../../../assets/style/variables';

.polyline-cards {
  .big-card,
  .polyline-card {
    @include trans-up-mixin(-1px);
    border-radius: 8px;
    margin-top: 20px;
    position: relative;

    .ant-card-body {
      padding: 12px;
    }

    .card-title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
      margin: 2px 0 10px 6px;
    }
  }

  .shrink-icon,
  .enlarge-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    background-size: 100% 100%;
    z-index: 1;
    cursor: pointer;
  }

  .enlarge-icon {
    background: url('../../../assets/img/enlarge.png') no-repeat;
    right: 10px;
    bottom: 10px;
  }

  .shrink-icon {
    background: url('../../../assets/img/shrink.png') no-repeat;
    right: 15px;
    bottom: 15px;
  }

  .big-card {
    height: 480px;

    .shrink-icon {
      visibility: hidden;
    }

    &:hover {
      .shrink-icon {
        visibility: visible;
      }
    }
  }

  .polyline-card {
    height: 255px;
    &.ant-card-loading {
      height: auto;
    }

    .enlarge-icon {
      visibility: hidden;
    }

    &:hover {
      .enlarge-icon {
        visibility: visible;
      }
    }
  }
}
</style>
