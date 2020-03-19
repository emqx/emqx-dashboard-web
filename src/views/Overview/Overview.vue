<template>
  <div class="overview app-wrapper">
    <el-row class="content-wrapper" :gutter="20">

      <el-col :span="6">
        <a-card
          class="app-card" :bordered="true" :loading="pageLoading" hoverable
          @click="clickToShowChart('sent')"
        >
          <div class="app-card-title">
            {{ $t('Overview.messageOut') }}
          </div>

          <div class="content">
            <span>
              {{ currentMetrics.sent }}
            </span>
            <span class="unit">{{ $t('Overview.strip') }}/{{ $t('Overview.second') }}</span>

            <div class="flux-wrapper">
              <simple-line :value="currentMetricsLogs.sent" type="bar" color="#34c388"></simple-line>
            </div>
          </div>

          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.currentMessageOutRate') }}
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card
          class="app-card" :bordered="true" :loading="pageLoading" hoverable
          @click="clickToShowChart('received')"
        >
          <div class="app-card-title">
            {{ $t('Overview.messageIn') }}
          </div>

          <div class="content">
            <span>
              {{ currentMetrics.received }}
            </span>
            <span class="unit">{{ $t('Overview.strip') }}/{{ $t('Overview.second') }}</span>

            <div class="flux-wrapper">
              <simple-line v-model="currentMetricsLogs.received" type="bar"></simple-line>
            </div>
          </div>

          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.currentMessageInRate') }}
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card
          class="app-card" :bordered="true" :loading="pageLoading" hoverable
          @click="clickToShowChart('subscriptions')"
        >
          <div class="app-card-title">
            {{ $t('Overview.subscriptionNumber') }}
          </div>

          <div class="content">
            <span>
              {{ currentMetrics.subscription }}
            </span>
            <div class="flux-wrapper">
              <simple-line v-model="currentMetricsLogs.subscription" color="#58afff" type="bar"></simple-line>
            </div>
          </div>

          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.topicNumber') }}
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col v-if="$hasShow('monitor.connections')" :span="6">
        <a-card
          class="app-card" :bordered="true" hoverable :loading="pageLoading"
          @click="clickToShowChart('connection')"
        >
          <div class="app-card-title">
            {{ $t('Overview.connectionNumber') }}
          </div>

          <div class="content">
            <span>
              {{ _formatNumber(currentMetrics.connection) }}
            </span>
            <el-progress
              class="status-progress"
              :stroke-width="20"
              :percentage="licensePercentage"
              :format="() => ''"
              :color="getProgressColor(licensePercentage, '#2DC8B2')"
            ></el-progress>
          </div>
          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.connectionsTips') }}
            </div>
          </div>
        </a-card>
      </el-col>

    </el-row>

    <a-card class="node-wrapper" :loading="pageLoading">
      <div :class="['emq-title', dataType !== 'basic' ? 'node-chart-data' : '']">
        <div class="title">
          {{ $t('Overview.nodeData') }}
        </div>
        <div class="type-filter">
          <emq-select
            v-if="dataType === 'basic'" v-model="nodeName" size="mini" style="margin-right: 20px"
            :field="{ options: nodes }" :field-name="{ label: 'name', value: 'node' }"
            @change="dataTypeChange"
          ></emq-select>
          <el-radio-group v-model="dataType" size="mini" @change="dataTypeChange">
            <el-radio-button v-for="(item, i) in dataTypeFilter" :key="i" :label="item.value">
              {{ item.text }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div v-if="dataType === 'basic'" class="basic">
        <el-row :gutter="20">
          <node-basic-card :value="currentNode"></node-basic-card>
        </el-row>
      </div>

      <template v-else>
        <div
          v-for="item in dataTypeFilter"
          :key="item.value"
          class="basic"
        >
          <template v-if="dataType === item.value">
            <metric-line
              :ref="item.value"
              :chart-id="`${item.value}-chart`"
              :y-title="metricTitles"
              :chart-data="metricLog[item.value]"
            ></metric-line>
          </template>
        </div>
      </template>

    </a-card>

    <a-card v-if="$hasShow('monitor.license')" class="license-card" :loading="pageLoading">
      <div class="emq-title">
        {{ $t('Overview.license') }}
      </div>

      <ul class="license-field">
        <li class="item">
          <span class="key">{{ $t('Overview.customer') }}:</span>
          <span class="value">{{ license.customer }}</span>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.numberOfConnectionLines') }}:</span>
          <div class="content">
            <el-progress
              class="license-progress"
              :stroke-width="12"
              :percentage="licensePercentage"
              :format="formatConnection"
              :color="getProgressColor(licensePercentage, '#34c388')"
            ></el-progress>
          </div>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.issuanceOfEmail') }}:</span>
          <span class="value">{{ license.email }}</span>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.issuedAt') }}:</span>
          <span class="value broker">{{ license.issued_at }}</span>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.expireAt') }}:</span>
          <span class="value broker">{{ license.expiry_at }}</span>
        </li>
      </ul>

      <div v-if="$hasShow('monitor.connections')" class="license-card-footer">
        <div class="description">
          {{ $t('Overview.beforeTheCertificateExpires') }}
        </div>
        <div v-if="license.type === 'trial'" class="oper">
          <el-tooltip
            effect="dark" :content="$t('Overview.forTrialEdition')" placement="top" :visible-arrow="false"
          >
            <el-tag type="danger">{{ $t('Overview.trialEdition') }}</el-tag>
          </el-tooltip>
        </div>
      </div>
    </a-card>

  </div>
</template>


<script>
import Moment from 'moment'
import {
  loadNodes as loadNodesApi, loadCurrentMetrics, loadLicenseInfo, loadMetricsLog,
} from '@/api/overview'
import MetricLine from '@/views/Overview/components/MetricLine'
import NodeBasicCard from './components/NodeBasicCard'
import SimpleLine from './components/SimpleLine'

export default {
  name: 'Overview',

  components: {
    MetricLine,
    NodeBasicCard,
    SimpleLine,
  },

  props: {},

  data() {
    return {
      pageLoading: true,
      tableLoading: false,
      nodeName: '',
      initCurrentNode: {
        connections: 16,
        load1: '14.01',
        load15: '11.85',
        load5: '12.54',
        max_fds: 7168,
        memory_total: '126.59M',
        memory_used: '97.05M',
        node: 'emqx@127.0.0.1',
        node_status: 'Running',
        otp_release: 'R21/10.3.4',
        process_available: 2097152,
        process_used: 402,
        uptime: '12 minutes, 37 seconds',
        version: '0.0.0+build.1.ref8234b61',
      },
      timer: 0,
      dataType: 'basic',
      dataTypeMap: {
        basic: this.$t('Overview.basicInfo'),
        sent: this.$t('Overview.messageOut'),
        received: this.$t('Overview.messageIn'),
        dropped: this.$t('Overview.messageDrop'),
        connection: this.$t('Overview.connection'),
        route: this.$t('Overview.topics'),
        subscriptions: this.$t('Overview.Subscription'),
      },
      nodes: [],
      license: {
        customer: '',
        email: '',
        plugins: '',
        max_connections: 100000,
        issued_at: '',
        expiry_at: '',
        vendor: '',
        version: '',
        type: 'trial',
      },
      metricTitles: [],
      metricLog: {
        sent: this.chartDataFill(32),
        received: this.chartDataFill(32),
        dropped: this.chartDataFill(32),
        connection: this.chartDataFill(32),
        route: this.chartDataFill(32),
        subscriptions: this.chartDataFill(32),
      },
      currentMetricsLogs: {
        received: {
          x: Array(32).fill('N/A'),
          y: Array(32).fill(0),
        },
        sent: {
          x: Array(32).fill('N/A'),
          y: Array(32).fill(0),
        },
        subscription: {
          x: Array(32).fill('N/A'),
          y: Array(32).fill(0),
        },
      },
      currentMetrics: {
        node: 0, // 节点数
        received: 0, // 消息 in 速率
        sent: 0, // 消息 out 速率
        subscription: 0, // 订阅数
        connection: 0, // 连接数
      },
    }
  },

  computed: {
    licensePercentage() {
      const { connection } = this.currentMetrics
      const { max_connections } = this.license
      const value = Math.floor((connection / max_connections) * 100)
      if (value < 2) {
        return 2
      }
      return value
    },
    dataTypeFilter() {
      return Object.entries(this.dataTypeMap).map(([value, text]) => ({ text, value }))
    },
    currentNode() {
      const node = this.nodes.find($ => $.node === this.nodeName)
      if (node) {
        const { stats, ...withoutStats } = node
        return {
          ...stats,
          ...withoutStats,
        }
      }
      return this.initCurrentNode
    },
  },

  created() {
    this.pageLoading = true
    this.loadData()
    this.loadLicenseData()
    clearInterval(this.timerData)
    this.timerData = setInterval(() => {
      this.loadData()
      this.loadNodes()
    }, 10 * 1000)
    this.dataTypeChange()
  },

  beforeDestroy() {
    clearInterval(this.timerData)
    clearInterval(this.timerMetrics)
  },

  methods: {
    chartDataFill(length) {
      return Array.from(
        { length },
        () => ({ xData: [], yData: [] }),
      )
    },
    dataTypeChange() {
      clearInterval(this.timerMetrics)
      if (this.dataType === 'basic') {
        this.loadNodes()
      } else {
        this.loadMetricsLogData()
      }
    },
    async loadNodes() {
      this.nodes = await loadNodesApi()
      this.nodeName = this.nodeName || (this.nodes[0] || {}).node
    },
    async setMetricsChartRealTime() {
      const data = await loadMetricsLog(false, this.dataType)
      const currentData = this.metricLog[this.dataType]
      this.metricTitles.forEach((key, index) => {
        const nodeMetric = data[key]
        const lastData = nodeMetric[nodeMetric.length - 1]
        if (currentData[index].xData.length >= 120) {
          currentData[index].xData.shift()
          currentData[index].yData.shift()
        }
        currentData[index].xData.push(this._formatTime(lastData[0]))
        currentData[index].yData.push(lastData[1])
      })
    },
    _formatTime(time) {
      return Moment(time).utcOffset(0).format('HH:mm')
    },
    async loadMetricsLogData() {
      this.tableLoading = true
      try {
        const data = await loadMetricsLog(false, this.dataType)
        this.metricTitles = Object.keys(data)
        this.metricLog[this.dataType] = this.chartDataFill(this.metricTitles.length)
        const currentData = this.metricLog[this.dataType]
        this.metricTitles.forEach((key, index) => {
          data[key].forEach((item) => {
            currentData[index].xData.push(this._formatTime(item[0]))
            currentData[index].yData.push(item[1])
          })
        })
        this.timerMetrics = setInterval(this.setMetricsChartRealTime, 60000)
      } catch (e) {
        console.error(e)
      } finally {
        this.tableLoading = false
      }
    },
    upgradeLicense() {
    },
    formatConnection() {
      const { connection } = this.currentMetrics
      const { max_connections } = this.license
      return `${this._formatNumber(connection)}/${this._formatNumber(max_connections)}`
    },
    _formatNumber(num) {
      if (num > 10000) {
        const value = (num / 1000)
        return `${parseInt(value * 100, 10) / 100}K`
      }
      return num
    },
    async loadLicenseData() {
      this.license = await loadLicenseInfo()
    },
    async loadData() {
      const state = await loadCurrentMetrics()
      this.pageLoading = false
      if (!state) {
        return
      }
      this.currentMetrics = state
      this.setCurrentMetricsLogsRealtime(state)
    },
    getNow() {
      return Moment().format('HH:mm:ss')
    },
    setCurrentMetricsLogsRealtime(state = {}) {
      ['received', 'sent', 'subscription'].forEach((key) => {
        this.currentMetricsLogs[key] = this.currentMetricsLogs[key] || { x: [], y: [] }
        const currentValue = state[key] || 0
        this.currentMetricsLogs[key].x.push(this.getNow())
        this.currentMetricsLogs[key].y.push(currentValue)
        if (this.currentMetricsLogs[key].x.length >= 32) {
          this.currentMetricsLogs[key].x.shift()
          this.currentMetricsLogs[key].y.shift()
        }
      })
    },
    getProgressColor(val, primaryColor) {
      let color = primaryColor
      if (val === 100) {
        color = '#f5222d'
      } else if (val >= 85 && val < 100) {
        color = '#faad14'
      }
      return color
    },
    clickToShowChart(dataType) {
      if (this.dataType === dataType) {
        return
      }
      this.dataType = dataType
      this.dataTypeChange()
    },
  },
}
</script>


<style lang="scss">
@import "../../assets/style/variables";

.overview {
  .status-count {
    text-align: center;
  }

  .flux-wrapper {
    width: 100%;
    box-sizing: border-box;

    .simple-line {
      box-sizing: border-box;
      height: 32px;
    }
  }

  .license-card {
    margin-top: 32px;
  }

  .app-card {
    @include trans-up-mixin(-1px);
    border-radius: 6px;

    .ant-card-head {
      border-bottom: none;
      padding: 0 16px;
    }

    .app-card-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
    }

    .ant-card-body {
      padding: 16px 16px 0 16px;
    }

    .content {
      color: rgba(0, 0, 0, 0.85);
      min-height: 90px;
      font-size: 30px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e8e8e8;
      position: relative;

      .unit {
        font-size: 14px;
        margin-left: 2px;
      }

      .charts {
        margin-top: 6px;
      }
    }

    .app-footer {
      padding: 10px 0;

      .footer-item {
        color: rgba(0, 0, 0, 0.65);

        .item-value {
          color: rgba(0, 0, 0, .85);
          margin-left: 12px;
        }
      }
    }
  }

  .node-wrapper {
    margin-top: 32px;

    .emq-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .node-chart-data {
      margin-bottom: 32px;
    }
  }

  .license-card {
    .license-card-footer {
      display: flex;
      margin-top: 12px;
      align-items: center;
      justify-content: space-between;

      .description {
        font-size: 12px;
        color: #B2B2B2;
        line-height: 1.4;
        width: 440px;
      }

      .oper {
        width: 100px;
        text-align: center;
        font-size: 14px;
        .el-tag {
          display: block;
        }
      }
    }

  }

  .license-field {
    list-style-type: none;
    padding-left: 0;

    .item {
      font-size: 14px;
      color: #666;
      padding: 6px 0;

      .key {
        margin-right: 24px;
      }

      .value {
        color: #333;

        &.broker {
          margin-top: 6px;
        }
      }

      .content {
        margin-top: 6px;
      }

      .el-progress {
        .el-progress__text {
          display: block;
          padding-left: 0;
          margin-top: 6px;
          margin-left: 0;
          font-size: 12px !important;
        }
      }
    }
  }

  .el-progress {
    .el-progress-bar {
      padding-right: 0;
    }
    &.status-progress {
      .el-progress-bar__outer {
        border-radius: 0px;
      }
      .el-progress-bar__inner {
        border-radius: 0px;
      }
    }
  }

  .emq-title {
    margin-bottom: 20px;
  }

  .data-list {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
