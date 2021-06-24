<template>
  <div class="overview app-wrapper">
    <div class="basic-info">
      <div class="basic-graph">
        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Overview.currentMessageOutRate') }}
            </div>

            <div class="content">
              <span>
                {{ currentMetrics.sent }}
              </span>
              <span class="unit">{{ $t('Overview.strip') }}/{{ $t('Overview.second') }}</span>

              <div class="flux-wrapper">
                <simple-line
                  :value="currentMetricsLogs.sent"
                  type="bar"
                  color="#34c388"
                ></simple-line>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Overview.currentMessageInRate') }}
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
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Overview.subscriptionNumber') }}
            </div>

            <div class="content">
              <span>
                {{ currentMetrics.subscription }}
              </span>
              <div class="flux-wrapper">
                <simple-line
                  v-model="currentMetricsLogs.subscription"
                  color="#58afff"
                  type="bar"
                ></simple-line>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t('Overview.connectionsTips') }}
            </div>

            <div class="content">
              <span>
                {{ _formatNumber(currentMetrics.connection) }}
              </span>
              <el-progress
                class="status-progress"
                :stroke-width="24"
                :percentage="licensePercentage"
                :format="() => ''"
                :color="getProgressColor(licensePercentage, '#2A78FFFF')"
              ></el-progress>
            </div>
          </el-card>
        </el-col>
      </div>
    </div>

    <!-- <el-card shadow="never" class="node-wrapper">
      <div class="emq-title">
        <div class="title">
          {{ $t('Overview.nodeData') }}
        </div>

        <el-dropdown @command="dataTypeChange" :style="{ cursor: 'pointer' }">
          <span class="el-dropdown-link">
            {{ this.nodeName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="node of nodes" :key="node.node" :command="node.node">{{
              node.node
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="basic">
        <el-row :gutter="20">
          <node-basic-card :value="currentNode"></node-basic-card>
        </el-row>
      </div>
    </el-card> -->

    <!-- <percentage-cards ref="percentageCards"></percentage-cards> -->

    <polyline-cards></polyline-cards>

    <div shadow="never" class="license-card">
      <div class="lisence-title">
        {{ $t('Overview.license') }}
      </div>

      <ul class="license-field">
        <li v-if="license.customer_type !== evaluation" class="item">
          <span class="key">{{ $t('Overview.customer') }}:</span>
          <span class="value">{{ license.customer }}</span>
        </li>

        <li class="item">
          <span class="key"
            >{{ $t('Overview.numberOfConnectionLines') }}: {{ formatConnection }}</span
          >
          <div class="content">
            <el-progress
              :stroke-width="16"
              :format="() => ''"
              :percentage="licensePercentage"
              :color="getProgressColor(licensePercentage,'#00A890FF')"
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

      <div class="license-card-footer">
        <div
          v-if="license.customer_type === evaluation"
          class="description"
          v-html="$t('Overview.licenseEvaluationTip')"
        ></div>
        <div
          v-else-if="license.expiry === true"
          class="description"
          v-html="$t('Overview.licenseExpiryTip')"
        ></div>
        <div v-else class="description">
          {{ $t('Overview.beforeTheCertificateExpires') }}
        </div>
        <div
          v-if="
            (license.type === 'trial' &&
              license.customer_type !== evaluation &&
              license.expiry === false)
          "
          class="oper"
        >
          <el-tag type="danger">{{ $t('Overview.trialEdition') }}</el-tag>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="licenseTipVisible"
      :close-on-click-modal="false"
      :title="$t('Base.warning')"
    >
      <div class="tip-content">
        <span v-if="!isLicenseExpiry" v-html="$t('Overview.licenseEvaluationTip')"></span>
        <span v-else v-html="$t('Overview.licenseExpiryTip')"></span>
      </div>
      <div v-if="!isLicenseExpiry" class="tip-checkbox">
        <el-checkbox v-model="noprompt" @change="liceEvaTipShowChange">{{
          $t('Overview.notPromptAgain')
        }}</el-checkbox>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="licenseTipVisible = false">{{
          $t('Overview.konw')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Moment from 'moment'
import { loadNodes as loadNodesApi, loadCurrentMetrics, loadLicenseInfo } from '@/api/overview'
// import NodeBasicCard from './components/NodeBasicCard'
import SimpleLine from './components/SimpleLine'
// import PercentageCards from './components/PercentageCards'
import PolylineCards from './components/PolylineCards'

export default {
  name: 'Overview',

  components: {
    // NodeBasicCard,
    SimpleLine,
    // PercentageCards,
    PolylineCards,
  },

  props: {},

  data() {
    return {
      evaluation: 10,
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
      licenseTipVisible: false,
      isLicenseExpiry: false,
      noprompt: false,
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
    formatConnection() {
      const { connection } = this.currentMetrics
      const { max_connections } = this.license
      return `${this._formatNumber(connection)} / ${this._formatNumber(max_connections)}`
    },
  },

  created() {
    this.loadData()
    this.loadLicenseData()
    clearInterval(this.timerData)
    this.timerData = setInterval(() => {
      this.loadData()
      this.loadNodes()
      // this.$refs.percentageCards.loadMetricsData()
    }, 10 * 1000)
    this.dataTypeChange()
  },

  beforeDestroy() {
    clearInterval(this.timerData)
  },

  methods: {
    liceEvaTipShowChange(val) {
      if (val) {
        localStorage.setItem('licenseTipVisible', false)
      }
    },
    dataTypeChange(val) {
      this.nodeName = val
      this.loadNodes()
    },
    async loadNodes() {
      this.nodes = await loadNodesApi()
      this.nodeName = this.nodeName || (this.nodes[0] || {}).node
    },

    _formatNumber(num) {
      let number = String(parseInt(num))
      return number.replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,')
    },
    async loadLicenseData() {
      this.license = await loadLicenseInfo()
      // evaluation 许可证
      if (
        this.license.customer_type === this.evaluation &&
        localStorage.getItem('licenseTipVisible') !== 'false'
      ) {
        this.licenseTipVisible = true
        this.isLicenseExpiry = false
      }
      // 证书过期
      if (this.license.expiry === true) {
        this.licenseTipVisible = true
        this.isLicenseExpiry = true
      }
    },
    async loadData() {
      const state = await loadCurrentMetrics()
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
      ;['received', 'sent', 'subscription'].forEach((key) => {
        this.currentMetricsLogs[key] = this.currentMetricsLogs[key] || {
          x: [],
          y: [],
        }
        const currentValue = state[key] || 0
        this.currentMetricsLogs[key].x.push(this.getNow())
        this.currentMetricsLogs[key].y.push(currentValue)
        if (this.currentMetricsLogs[key].x.length >= 32) {
          this.currentMetricsLogs[key].x.shift()
          this.currentMetricsLogs[key].y.shift()
        }
      })
    },
    getProgressColor(val,primaryC) {
      let color = primaryC
      let num = parseInt(val)
      if (num >= 100) {
        color = '#E34242FF'
      } else if (num >= 85 && num < 100) {
        color = '#FB9237FF'
      }
      return color
    },
  },
}
</script>

<style lang="scss" scoped>
.basic-info {
  display: flex;
  .basic-graph {
    overflow: hidden;
    width: 50%;
    // display: inline-grid;
  }
}
.app-card {
  margin: 10px;

  .app-card-title {
    font-size: 14px;
    margin-bottom: 15px;
    color: rgba(0, 0, 0, 0.4);
  }

  .content {
    color: rgba(0, 0, 0, 0.85);
    min-height: 90px;
    font-size: 30px;
    position: relative;

    .unit {
      font-size: 14px;
      margin-left: 2px;
    }

    .charts {
      margin-top: 6px;
    }
  }

}

.license-card {
  margin: 30px 10px 10px;

  .license-card-footer {
    display: flex;
    margin-top: 12px;

    .description {
      font-size: 12px;
      color: #b2b2b2;
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
      margin-top: 15px;
    }
  }
}

.lisence-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 700;
}

.tip-checkbox {
  margin-top: 20px;
  .el-checkbox {
    color: #aaa;
  }
}
</style>
