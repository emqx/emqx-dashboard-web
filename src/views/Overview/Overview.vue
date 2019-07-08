<template>
  <div class="overview app-wrapper">
    <!--<div class="page-header">{{ $t('Overview.brokerStatus') }}</div>-->

    <el-row class="content-wrapper" :gutter="20">
      <!--
      <el-col :span="6">
        <a-card class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="app-card-title">
            {{ $t('Overview.nodesNun') }}
          </div>

          <div class="content">
            <emq-count-to v-model="currentMetrics.node"></emq-count-to>
          </div>
          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.numberOfNodesInCluster') }}
            </div>
          </div>
        </a-card>
      </el-col>
      -->


      <el-col :span="6">
        <a-card class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="app-card-title">
            {{ $t('Overview.messageOut') }}
          </div>

          <div class="content">
            <emq-count-to v-model="currentMetrics.sent"></emq-count-to>
            <span class="unit">{{ $t('Overview.strip') }}/秒</span>

            <div class="flux-wrapper">
              <simple-line v-model="currentMetricsLogs.sent" type="bar" color="#34c388"></simple-line>
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
        <a-card class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="app-card-title">
            {{ $t('Overview.messageIn') }}
          </div>

          <div class="content">
            <emq-count-to v-model="currentMetrics.received"></emq-count-to>
            <span class="unit">{{ $t('Overview.strip') }}/秒</span>

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
        <a-card class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="app-card-title">
            {{ $t('Overview.subscriptionNumber') }}
          </div>

          <div class="content">
            <emq-count-to v-model="currentMetrics.subscription"></emq-count-to>
            <div class="flux-wrapper">
              <simple-line v-model="currentMetricsLogs.subscription" color="#58afff"></simple-line>
            </div>
          </div>


          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.topicNumber') }}
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card class="app-card" :bordered="true" hoverable :loading="pageLoading">
          <div class="app-card-title">
            {{ $t('Overview.connectionNumber') }}
          </div>

          <div class="content">
            <div class="status-count">
              <el-progress
                :width="72"
                :stroke-width="10"
                type="circle"
                :percentage="licensePercentage"
                :format="formatConnection"
              >
              </el-progress>
            </div>
            <!--<emq-count-to v-model="currentMetrics.connection"></emq-count-to>-->
          </div>
          <div class="app-footer">
            <div class="footer-item">
              {{ $t('Overview.maxConnections') }}
              <span class="item-value">
                <emq-count-to v-model="state.subscribers_max"></emq-count-to>
              </span>
            </div>
          </div>
        </a-card>
      </el-col>

    </el-row>

    <a-card class="node-wrapper" :loading="tableLoading">
      <div class="emq-title">
        <div class="title">
          {{ $t('Overview.nodeData') }}
        </div>
        <div class="type-filter">
          <emq-select v-if="dataType === 'basic'" v-model="nodeName" size="mini" style="margin-right: 20px"
                      :field="{ options: nodes }" :field-name="{ label: 'name', value: 'name' }"
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
          <!--<el-col :span="18">-->
          <node-basic-card :value="currentNode"></node-basic-card>
          <!--</el-col>-->
          <!--<el-col :span="6">-->
          <!--<node-item v-model="nodeName" :list="nodes"></node-item>-->
          <!--</el-col>-->
        </el-row>


      </div>

      <div v-else v-loading="tableLoading" class="basic" style="margin-bottom: -32px">
        <div v-if="activeMetrics.data.length === 0 && !tableLoading" class="data-list">
          <p>{{ $t('Overview.noData') }}</p>
        </div>
        <metric-line v-else :value="activeMetrics"></metric-line>
      </div>

    </a-card>


    <a-card class="license-card" :loading="pageLoading">
      <div class="emq-title">
        莱森斯信息
      </div>

      <ul class="license-field">
        <li class="item">
          <span class="key">{{ $t('Overview.customer') }}:</span>
          <span class="value">{{ license.customer }}</span>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.numberOfConnectionLines') }}:</span>
          <div class="content">
            <el-progress :stroke-width="12" :percentage="licensePercentage" color="#34c388"
                         :format="formatConnection"
            ></el-progress>
          </div>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.issuanceOfEmail') }}:</span>
          <span class="value">{{ license.email }}</span>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.issuedAt') }}:</span>
          <div class="value broker">{{ license.issued_at }}</div>
        </li>

        <li class="item">
          <span class="key">{{ $t('Overview.expireAt') }}:</span>
          <div class="value broker">{{ license.expiry_at }}</div>
        </li>
      </ul>

      <div class="license-card-footer">
        <div class="description">
          {{ $t('Overview.beforeTheCertificateExpires') }}
        </div>
        <div v-if="license.type = 'trial'" class="oper">
          <el-tooltip effect="dark" content="当前莱森斯为试用版" placement="top" :visible-arrow="false">
            <el-button type="danger" size="small" @click="upgradeLicense">{{ $t('Overview.trialEdition') }}</el-button>
          </el-tooltip>
        </div>
      </div>
    </a-card>

  </div>
</template>


<script>
import Moment from 'moment'
import { toTableData } from '@/common/utils'
import {
  loadState, loadCurrentMetrics, loadLicenseInfo, loadMetricsLog,
} from '@/api/overview'
import { loadNodes as loadNodesApi } from '@/api/common'
import EmqCountTo from '@/components/EmqCountTo'
import MetricLine from '@/views/Overview/components/MetricLine'
import NodeItem from './components/NodeItem'
import NodeBasicCard from './components/NodeBasicCard'
import SimpleLine from './components/SimpleLine'

window.Moment = Moment
export default {
  name: 'Overview',

  components: {
    MetricLine,
    NodeItem,
    NodeBasicCard,
    SimpleLine,
    EmqCountTo,
  },

  props: {},

  data() {
    const that = this
    return {
      pageLoading: true,
      tableLoading: false,
      nodeName: '',
      _currentNode: {
        connections: 16,
        load1: '14.01',
        load15: '11.85',
        load5: '12.54',
        max_fds: 7168,
        memory_total: '126.59M',
        memory_used: '97.05M',
        name: 'emqx@127.0.0.1',
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
        basic: that.$t('Overview.basicInfo'),
        sent: that.$t('Overview.messageOut'),
        received: that.$t('Overview.messageIn'),
        dropped: that.$t('Overview.messageDrop'),
        connection: that.$t('Overview.connect'),
        route: that.$t('Overview.topics'),
        subscriptions: that.$t('Overview.Subscription'),
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
      metricLog: {
        sent: { data: [], nodes: {} },
        received: { data: [], nodes: {} },
        dropped: { data: [], nodes: {} },
        connection: { data: [], nodes: {} },
        route: { data: [], nodes: {} },
        subscriptions: { data: [], nodes: {} },
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
      state: {
        connections_count: 0,
        connections_max: 0,
        subscribers_count: 0,
        subscribers_max: 0,
        message_count: 0,
        message_max: 0,
        message_rate_count: 0,
        message_rate_max: 0,
      },
      nodeList: [{
        key: 'tab1',
        tab: 'tab1',
      }, {
        key: 'tab2',
        tab: 'tab2',
      }],
      activeNode: 'tab1',
    }
  },

  computed: {
    activeMetrics() {
      if (this.metricLog[this.dataType]) {
        return this.metricLog[this.dataType]
      }
      return { nodes: [], data: [] }
    },
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
      const node = this.nodes.find($ => $.name === this.nodeName)
      if (node) {
        return node
      }
      return this._currentNode
    },
  },

  created() {
    this.pageLoading = true
    this.loadData()
    this.loadLicenseData()
    clearInterval(this.timer)
    this.timer = setInterval(this.loadData, 10 * 1000)
    this.dataTypeChange()
  },

  beforeRouteLeave(form, to, next) {
    clearInterval(this.timer)
    next()
  },

  filter: {
    numFormat(s, type) {
      if (/[^0-9.]/.test(s)) return '0'
      if (s == null || s === 'null' || s === '') {
        return '0'
      }
      s = s.toString().replace(/^(\d*)$/, '$1.')
      s = (`${s}00`).replace(/(\d*\.\d\d)\d*/, '$1')
      s = s.replace('.', ',')
      const re = /(\d)(\d{3},)/
      while (re.test(s)) {
        s = s.replace(re, '$1,$2')
      }

      s = s.replace(/,(\d\d)$/, '.$1')
      const a = s.split('.')
      if (a[1] === '00') {
        s = a[0]
      }
      return s.replace('.00', '')
    },
  },

  methods: {
    async loadNodes() {
      this.nodes = await loadNodesApi()
      this.nodeName = this.nodeName || (this.nodes[0] || {}).name
    },
    dataTypeChange() {
      const type = this.dataType
      switch (type) {
        case 'basic':
          this.loadNodes()
          break
        default:
          this.loadMetricsLogData()
          break
      }
    },
    async loadMetricsLogData() {
      this.tableLoading = true
      try {
        const data = await loadMetricsLog(false, this.dataType)
        this.metricLog[this.dataType] = toTableData(data) || { nodes: [], data: [] }
      } catch (e) {
        console.log(e)
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
        const value = (num / 10000)
        return `${parseInt(value * 100) / 100}W`
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
      this.state = await loadState()
      this.setCurrentMetricsLogs(state)
    },
    getNow() {
      return Moment().format('HH:mm:ss')
    },
    setCurrentMetricsLogs(state = {}) {
      ['received', 'sent', 'subscription'].forEach((key) => {
        const currentValue = state[key] || 0
        this.currentMetricsLogs[key].x.push(this.getNow())
        this.currentMetricsLogs[key].y.push(currentValue)
        if (this.currentMetricsLogs[key].x.length >= 32) {
          this.currentMetricsLogs[key].x.shift()
          this.currentMetricsLogs[key].y.shift()
        }
      })
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

  .node-basic-card {
    max-width: 800px;
  }

  .flux-wrapper {
    width: 100%;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    box-sizing: border-box;

    .simple-line {
      box-sizing: border-box;
      height: 32px;
    }
  }

  .license-card {
    margin-top: 32px;
  }

  .page-header {
    font-size: 20px;
    color: #101010;
  }

  .content-wrapper {
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

    & > .ant-card-head {
      /*padding: 0 8px;*/
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
        text-align: right;
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
        .el-progress-bar {
          padding-right: 0;
        }

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
