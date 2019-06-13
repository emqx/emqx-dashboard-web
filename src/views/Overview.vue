<template>
  <div class="overview">
    <div class="page-header">服务器状态</div>

    <el-row class="content-wrapper" :gutter="20">
      <el-col :span="6">
        <a-card title="连接数" class="app-card" :bordered="false" :loading="pageLoading" hoverable>
          <div class="content">{{ state.connections_count }}</div>
          <div class="app-footer">
            <div class="footer-item">
              最大连接数
              <span class="item-value">
                {{ state.connections_max }}
              </span>
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card title="消息" class="app-card" :bordered="false" :loading="pageLoading" hoverable>
          <div class="content">{{ state.message_rate_count }}/s</div>

          <div class="app-footer">
            <div class="footer-item">
              最大速率
              <span class="item-value">{{ state.message_rate_max }}/s</span>
            </div>
          </div>
        </a-card>
      </el-col>

      <el-col :span="6">
        <a-card title="订阅数" class="app-card" :bordered="false" hoverable :loading="pageLoading">
          <div class="content">{{ state.subscribers_count }}</div>

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
  </div>
</template>


<script>
import { loadState } from '@/api/overview'

export default {
  name: 'Overview',

  components: {},

  props: {},

  data() {
    return {
      pageLoading: true,
      timer: 0,
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
      const state = await loadState().catch(() => {})
      this.pageLoading = false
      if (!state) {
        return
      }
      this.state = state
    },
  },
}
</script>


<style lang="scss">
.overview {
  .page-header {
    font-size: 20px;
    color: #101010;
  }

  .content-wrapper {
    margin-top: 30px;
  }

  .app-card {
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
      text-align: center;
      padding: 0 16px 16px 16px;
      border-bottom: 1px dashed #e8e8e8;
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
}
</style>
