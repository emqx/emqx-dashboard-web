<template>
  <div class="overview app-wrapper">
    <el-row class="content-wrapper" :gutter="20">
      <el-col :span="6">
        <a-card class="app-card" :bordered="true" :loading="isCurrentMetricsLoading && pageLoading">
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
        <a-card class="app-card" :bordered="true" :loading="isCurrentMetricsLoading && pageLoading">
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
        <a-card class="app-card" :bordered="true" :loading="isCurrentMetricsLoading && pageLoading">
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
        <a-card class="app-card" :bordered="true" :loading="isCurrentMetricsLoading && pageLoading">
          <div class="app-card-title">{{ $t('Overview.activeConnection') }}</div>

          <div class="content">
            <span>{{ _formatNumber(currentMetrics.live_connection) }}</span>
            <div class="flux-wrapper">
              <connection-statistics
                :max-connections="license.max_connections"
                :connection-data="{
                  connection: currentMetrics.connection,
                  live_connection: currentMetrics.live_connection,
                }"
              ></connection-statistics>
            </div>
          </div>
          <div class="app-footer">
            <div class="footer-item is-flex">
              <span>
                {{ `${$t('Overview.allConnection')}: ${_formatNumber(currentMetrics.connection)}` }}
              </span>
              <span>
                {{ `${$t('Overview.limit')}: ${_formatNumber(license.max_connections)}` }}
              </span>
            </div>
          </div>
        </a-card>
      </el-col>
    </el-row>

    <a-card class="node-wrapper">
      <a-skeleton v-if="isNodesLoading && pageLoading" active :paragraph="{ rows: 8 }" />
      <template v-else>
        <div class="emq-title">
          <div class="title">
            {{ $t('Overview.nodeData') }}
          </div>
          <div class="type-filter">
            <emq-select
              v-model="nodeName"
              size="mini"
              style="margin-right: 20px"
              :field="{ options: nodes }"
              :field-name="{ label: 'name', value: 'node' }"
              @change="dataTypeChange"
            ></emq-select>
          </div>
        </div>
        <div class="basic">
          <el-row :gutter="20">
            <node-basic-card :value="currentNode"></node-basic-card>
          </el-row>
        </div>
      </template>
    </a-card>

    <percentage-cards ref="percentageCards"></percentage-cards>

    <polyline-cards></polyline-cards>

    <a-card v-if="$hasShow('monitor.license')" class="license-card" :loading="isLicenseLoading && pageLoading">
      <div class="emq-title">
        {{ $t('Overview.license') }}
      </div>

      <ul class="license-field">
        <li v-if="license.customer_type !== evaluation" class="item">
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
        <template v-if="license.customer_type !== evaluation">
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
        </template>
      </ul>
      <template v-if="$hasShow('monitor.connections')">
        <div class="license-card-footer">
          <div
            v-if="license.customer_type === evaluation"
            class="description"
            v-html="$t('Overview.licenseEvaluationTip')"
          ></div>
          <div v-else-if="license.expiry === true" class="description" v-html="$t('Overview.licenseExpiryTip')"></div>
          <div v-else class="description">{{ $t('Overview.beforeTheCertificateExpires') }}</div>
          <div
            v-if="license.type === 'trial' && license.customer_type !== evaluation && license.expiry === false"
            class="oper"
          >
            <el-tooltip effect="dark" :content="$t('Overview.forTrialEdition')" placement="top" :visible-arrow="false">
              <el-tag type="danger">{{ $t('Overview.trialEdition') }}</el-tag>
            </el-tooltip>
          </div>
        </div>
        <LicenseUploaded @uploaded="loadLicenseData" />
      </template>
    </a-card>

    <el-dialog
      title="标题"
      :width="`${licenseTipWidth}px`"
      :visible.sync="licenseTipVisible"
      :close-on-click-modal="false"
    >
      <div slot="title" class="tip-title">
        <i class="el-icon-warning"></i>
        <span>{{ $t('Base.warning') }}</span>
      </div>
      <div class="tip-content">
        <p v-if="!isLicenseExpiry" v-html="$t('Overview.licenseEvaluationTip')">
          {{ $t('Overview.licenseEvaluationTip') }}
        </p>
        <p v-else v-html="$t('Overview.licenseExpiryTip')">
          {{ $t('Overview.licenseExpiryTip') }}
        </p>
      </div>
      <div v-if="!isLicenseExpiry" class="tip-checkbox">
        <el-checkbox v-model="noprompt" @change="liceEvaTipShowChange">{{ $t('Overview.notPromptAgain') }}</el-checkbox>
      </div>
      <div class="tip-button">
        <el-button type="primary" size="small" @click="licenseTipVisible = false">{{ $t('Overview.konw') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Moment from 'moment'
import { formatNumber } from '@/common/utils.js'
import { loadNodes as loadNodesApi, loadCurrentMetrics, loadLicenseInfo } from '@/api/overview'
import NodeBasicCard from './components/NodeBasicCard'
import SimpleLine from './components/SimpleLine'
import PercentageCards from './components/PercentageCards'
import PolylineCards from './components/PolylineCards'
import ConnectionStatistics from './components/ConnectionStatistics'
import LicenseUploaded from './components/LicenseUploaded'

export default {
  name: 'Overview',

  components: {
    NodeBasicCard,
    SimpleLine,
    PercentageCards,
    PolylineCards,
    ConnectionStatistics,
    LicenseUploaded,
  },

  props: {},

  data() {
    return {
      evaluation: 10,
      pageLoading: true,
      nodeName: '',
      initCurrentNode: {
        connections: 0,
        load1: '',
        load15: '',
        load5: '',
        max_fds: 0,
        memory_total: '',
        memory_used: '',
        node: '',
        node_status: '',
        otp_release: '',
        process_available: 0,
        process_used: 0,
        uptime: '',
        version: '',
      },
      timer: 0,
      nodes: [],
      isNodesLoading: false,
      licenseTipVisible: false,
      isLicenseExpiry: false,
      noprompt: false,
      licenseTipWidth: 460,
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
        expiry: false,
        customer_type: 0,
      },
      isLicenseLoading: false,
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
        live_connection: 0, // 活跃连接
      },
      isCurrentMetricsLoading: false,
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
    currentNode() {
      const node = this.nodes.find(($) => $.node === this.nodeName)
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

  async created() {
    this.pageLoading = true
    await Promise.all([this.loadData(), this.loadLicenseData(), this.dataTypeChange()])
    this.pageLoading = false
    this.startPolling()
  },

  beforeDestroy() {
    clearInterval(this.timerData)
  },

  methods: {
    startPolling() {
      clearInterval(this.timerData)
      this.timerData = setInterval(() => {
        this.loadData()
        this.loadNodes()
        this.$refs.percentageCards.loadMetricsData()
      }, 10 * 1000)
    },
    liceEvaTipShowChange(val) {
      if (val) {
        localStorage.setItem('licenseTipVisible', false)
      }
    },
    async dataTypeChange() {
      try {
        await this.loadNodes()
        return Promise.resolve()
      } catch (error) {
        return Promise.resolve()
      }
    },
    async loadNodes() {
      try {
        this.isNodesLoading = true
        this.nodes = await loadNodesApi()
        this.nodeName = this.nodeName || (this.nodes[0] || {}).node
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.isNodesLoading = true
      }
    },
    formatConnection() {
      const { connection } = this.currentMetrics
      const { max_connections } = this.license
      return `${formatNumber(connection)}/${formatNumber(max_connections)}`
    },
    async loadLicenseData() {
      try {
        this.isLicenseLoading = true
        this.license = await loadLicenseInfo()
        setTimeout(() => {
          // evaluation 许可证
          if (this.license.customer_type === this.evaluation && localStorage.getItem('licenseTipVisible') !== 'false') {
            this.licenseTipVisible = true
            this.isLicenseExpiry = false
            this.licenseTipWidth = 520
          }
          // 证书过期
          if (this.license.expiry === true) {
            this.licenseTipVisible = true
            this.isLicenseExpiry = true
            this.licenseTipWidth = 600
          }
        }, 1000)
        this.isLicenseLoading = false
        return Promise.resolve()
      } catch (error) {
        return Promise.resolve(error)
      }
    },
    async loadData() {
      try {
        this.isCurrentMetricsLoading = true
        const state = await loadCurrentMetrics()
        if (!state) {
          return Promise.resolve()
        }
        this.currentMetrics = state
        this.setCurrentMetricsLogsRealtime(state)
        return Promise.resolve()
      } catch (error) {
        console.error(error)
        return Promise.resolve()
      } finally {
        this.isCurrentMetricsLoading = false
      }
    },
    getNow() {
      return Moment().format('HH:mm:ss')
    },
    setCurrentMetricsLogsRealtime(state = {}) {
      ;['received', 'sent', 'subscription'].forEach((key) => {
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
    _formatNumber: formatNumber,
  },
}
</script>

<style lang="scss">
@import '../../assets/style/variables';

.overview {
  .status-count {
    text-align: center;
  }

  .flux-wrapper {
    width: 100%;
    box-sizing: border-box;

    .simple-line,
    .connection-statistics {
      box-sizing: border-box;
      height: 32px;
    }
  }

  .license-card,
  .node-wrapper {
    margin-top: 20px;
    border-radius: 8px;
  }

  .app-card {
    @include trans-up-mixin(-1px);
    border-radius: 8px;

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

    &.ant-card-loading .ant-card-body {
      padding-bottom: 8px;
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

        &.is-flex {
          display: flex;
          justify-content: space-between;
        }

        .item-value {
          color: rgba(0, 0, 0, 0.85);
          margin-left: 12px;
        }
      }
    }
  }

  .node-wrapper {
    .emq-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .license-card {
    .license-card-footer {
      display: flex;
      margin-top: 12px;
      margin-bottom: 12px;
      align-items: center;
      justify-content: space-between;

      .description {
        font-size: 12px;
        color: #b2b2b2;
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

  .tip-title {
    font-size: 18px;
    .el-icon-warning {
      color: #e6a23c;
    }
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }

  .tip-content {
    font-size: 16px;
    p {
      word-break: break-word;
    }
  }

  .tip-checkbox {
    margin-top: 10px;
    .el-checkbox {
      color: #aaa;
    }
  }

  .tip-button {
    text-align: right;
  }
  .ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title,
  .ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph > li {
    background: linear-gradient(90deg, rgba(207, 216, 220, 0.2), rgba(207, 216, 220, 0.4), rgba(207, 216, 220, 0.2));
  }
}
</style>
