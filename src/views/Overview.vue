<template>
  <div class="overview app-wrapper">
    <!--<div class="page-header">服务器状态</div>-->

    <el-row class="content-wrapper" :gutter="20">
      <el-col :span="6">
        <a-card title="节点数" class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="content">
            {{ currentMetrics.node }}
          </div>
          <div class="app-footer">
            <div class="footer-item">
              集群中节点数
              <!--<span class="item-value">-->
              <!--{{ state.connections_max }}-->
              <!--</span>-->
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card title="消息发出" class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="content">
            {{ currentMetrics.sent }}
            <span class="unit">条/秒</span>
          </div>
          <div class="app-footer">
            <div class="footer-item">
              消息流入
              <span class="item-value">
                {{ currentMetrics.received }}
                <span class="unit">条/秒</span>
              </span>
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card title="订阅数" class="app-card" :bordered="true" :loading="pageLoading" hoverable>
          <div class="content">{{ currentMetrics.subscription }}</div>

          <div class="app-footer">
            <div class="footer-item">
              集群订阅关系数
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card title="连接数" class="app-card" :bordered="true" hoverable :loading="pageLoading">
          <div class="content">{{ currentMetrics.connection }}</div>

          <div class="app-footer">
            <div class="footer-item">
              最大订阅数
              <span class="item-value">
                {{ state.subscribers_max }}
              </span>
            </div>
          </div>
        </a-card>
      </el-col>

    </el-row>

    <a-card class="node-wrapper" title="节点状态">
      等待接口
    </a-card>


    <a-card class="license-card" title="License 信息" :loading="pageLoading">
      <ul class="license-field">
        <li class="item">
          <span class="key">签发对象:</span>
          <span class="value">{{ license.customer }}</span>
        </li>

        <li class="item">
          <span class="key">连接线数:</span>
          <div class="content">
            <el-progress :stroke-width="12" :percentage="licensePercentage" color="#34c388"
                         :format="formatConnection"></el-progress>
          </div>
        </li>

        <li class="item">
          <span class="key">签发邮箱:</span>
          <span class="value">{{ license.email }}</span>
        </li>

        <li class="item">
          <span class="key">签发时间:</span>
          <div class="value broker">{{ license.issued_at }}</div>
        </li>

        <li class="item">
          <span class="key">到期时间:</span>
          <div class="value broker">{{ license.expiry_at }}</div>
        </li>
      </ul>

      <div class="license-card-footer">
        <div class="description">
          证书到期前 EMQ 将通过邮件通知签发邮箱，
          请留意信息接收以免错误续期时间影响业务。
        </div>
        <div class="oper">
          <el-button type="dashed" size="small">升级</el-button>
        </div>
      </div>
    </a-card>

  </div>
</template>


<script>
import { loadState, loadCurrentMetrics, loadLicenseInfo } from '@/api/overview'

export default {
  name: 'Overview',

  components: {},

  props: {},

  data() {
    return {
      pageLoading: true,
      timer: 0,
      license: {
        'customer': '北京中天九五科技发展有限公司',
        'email': 'liruilong@gas95.com',
        'plugins': 'emqx_backend_redis,  emqx_backend_mysql,  emqx_backend_pgsql,  emqx_backend_mongo,  emqx_backend_cassa,  emqx_bridge_kafka,  emqx_bridge_rabbit',
        'max_connections': 100000,
        'issued_at': '2019-05-05 08:31:04',
        'expiry_at': '2119-05-31 08:31:04',
        'vendor': 'EMQ Technologies Co., Ltd.',
        'version': '0.0.0+build.1.ref8234b61',
        'type': 'trial',
      },
      currentMetricsLogs: {
        received: [],
        sent: [],
        subscription: [],
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

  created() {
    this.pageLoading = true
    this.loadData()
    this.loadLicenseData()
    clearTimeout(this.timer)
    this.timer = setTimeout(this.loadData, 10 * 1000)
  },

  beforeRouteLeave(form, to, next) {
    clearTimeout(this.timer)
    next()
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
  },

  methods: {
    formatConnection() {
      const { connection } = this.currentMetrics
      const { max_connections } = this.license
      return `${this._formatNumber(connection)}/${this._formatNumber(max_connections)}`
    },
    _formatNumber(num) {
      if (num > 10000) {
        const value = (num / 10000)
        return `${value}W`
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
      this.state = state
      this.setCurrentMetricsLogs(state)
    },
    setCurrentMetricsLogs(state = {}) {
      ['received', 'sent', 'subscription'].forEach((key) => {
        const currentValue = state[key] || 0
        this.currentMetricsLogs[key].push([Date.now(), currentValue])
        if (this.currentMetricsLogs[key].length >= 30) {
          this.currentMetricsLogs[key].unshift()
        }
      })
    },
  },
}
</script>


<style lang="scss">
@import "../assets/style/variables";

.overview {
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

      .ant-card-head-title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.4);
      }
    }

    .ant-card-body {
      padding: 0 16px;
    }

    .content {
      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
      padding: 0 16px 16px 16px;
      border-bottom: 1px dashed #e8e8e8;


      .unit {
        font-size: 14px;
        margin-left: 4px;
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

    & > .ant-card-head {
      /*padding: 0 8px;*/
    }
  }

  .license-card {
    width: 500px;

    .license-card-footer {
      display: flex;
      margin-top: 12px;
      align-items: center;
      justify-content: space-between;

      .description {
        font-size: 12px;
        color: #B2B2B2;
        line-height: 1.4;
        width: 340px;
      }

      .oper {
        width: 100px;
      }
    }

  }

  .license-field {
    list-style-type: none;
    padding-left: 0;

    .item {
      font-size: 14px;
      color: #333;
      padding: 6px 0;

      .key {
        margin-right: 24px;
      }

      .value {
        font-weight: bold;
        color: #666;
        &.broker {
          margin-top: 6px;
        }
      }

      .content {
        margin-top: 6px;
      }

      .el-progress {
        .el-progress-bar {
          padding-right: 15%;
        }

        .el-progress__text {
          font-size: 14px !important;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
