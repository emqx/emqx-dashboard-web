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

    <a-card
      class="node-wrapper"
      :tab-list="nodeList"
      :active-tab-key="activeNode"
      :bordered="true" :loading="pageLoading" hoverable
      @tabChange="key => activeNode = key"
    >
      1
    </a-card>
  </div>
</template>


<script>
import { loadState, loadCurrentMetrics } from '@/api/overview'

export default {
  name: 'Overview',

  components: {},

  props: {},

  data() {
    return {
      pageLoading: true,
      timer: 0,
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
    clearTimeout(this.timer)
    this.timer = setTimeout(this.loadData, 10 * 1000)
  },

  beforeRouteLeave(form, to, next) {
    clearTimeout(this.timer)
    next()
  },

  methods: {
    async loadData() {
      const state = await loadCurrentMetrics()
      this.pageLoading = false
      if (!state) {
        return
      }
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
}
</style>
