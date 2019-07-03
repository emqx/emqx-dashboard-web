<template>
  <div class="connection-view">
    <div class="detail-header">
      <div class="detail-header-title">
        <el-breadcrumb class="title-content" separator="/">
          <el-breadcrumb-item :to="{ path: '/connections' }">连接</el-breadcrumb-item>
          <el-breadcrumb-item>{{ clientId }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="title-status">
          <a-badge :type="connStatus" :status="connStatus" :text="connStatusText"></a-badge>
        </div>
      </div>
      <el-tabs v-model="activeName" class="detail-footer" @tab-click="handleTabClick">
        <el-tab-pane label="基本信息" name="detail"></el-tab-pane>
        <el-tab-pane label="订阅列表" name="subscriptions"></el-tab-pane>
      </el-tabs>
    </div>

    <a-card v-if="activeName === 'detail'" class="detail-card">
      <div class="emq-title">
        连接信息
      </div>

      <ul class="field-info">
        <el-row :gutter="40">
          <el-col :span="12">
            <li class="field-info-item">
              <div class="field-title">Client ID：</div>
              <span class="field-value">{{ record.client_id }}</span>
            </li>
            <li class="field-info-item">
              <div class="field-title">Username：</div>
              <span class="field-value">{{ record.username }}</span>
            </li>
            <li class="field-info-item">
              <div class="field-title">连接时间：</div>
              <span class="field-value">{{ record.connected_at }}</span>
            </li>
            <li class="field-info-item">
              <div class="field-title">Address：</div>
              <span class="field-value">{{ record.ipaddress }}:{{ record.port }}</span>
            </li>
            <li class="field-info-item">
              <div class="field-title">Clean Start：</div>
              <span class="field-value">{{ record.clean_start }}</span>
            </li>
            <li class="field-info-item">
              <div class="field-title">keepalive：</div>
              <span class="field-value">{{ record.keepalive }}</span>
            </li>
          </el-col>
        </el-row>
      </ul>
    </a-card>


    <a-card v-if="activeName === 'detail'" class="detail-card">
      <div class="emq-title">
        协议信息
      </div>

      <ul class="field-info">
        <li class="field-info-item">
          <div class="field-title">协议类型：</div>
          <span class="field-value">{{ record.proto_name }}</span>
        </li>
        <li class="field-info-item">
          <div class="field-title">协议版本：</div>
          <span class="field-value">{{ record.proto_ver }}</span>
        </li>
        <li class="field-info-item">
          <div class="field-title">SSL 证书：</div>
          <span class="field-value">{{ record.peercert }}</span>
        </li>
        <li class="field-info-item">
          <div class="field-title">接入分区：</div>
          <span class="field-value">{{ record.zone }}</span>
        </li>
      </ul>
    </a-card>


    <a-card v-if="activeName === 'subscriptions'">
      <div class="emq-title">
        当前订阅

        <div class="subscriptions-header">
          <el-button plain size="mini" icon="el-icon-refresh" @click="loadData">刷新</el-button>
          <el-button plain size="mini" icon="el-icon-plus" @click="handlePreAdd">添加订阅</el-button>
        </div>
      </div>


      <el-table :data="subscriptions" class="data-list">
        <el-table-column prop="topic" min-width="110px" show-overflow-tooltip label="Topic"></el-table-column>
        <el-table-column prop="qos" min-width="110px" label="QoS"></el-table-column>
        <el-table-column prop="node" min-width="80px" label="节点"></el-table-column>
        <el-table-column prop="client_id" width="80px">
          <template slot-scope="{ row }">
            <el-button type="dashed" size="mini" @click="handleUnSubscription(row)">取消订阅</el-button>
          </template>
        </el-table-column>
      </el-table>

    </a-card>

    <create-subscribe
      :visible.sync="dialogVisible"
      :client-id="record.client_id"
      @created="loadData"
    >
    </create-subscribe>

  </div>
</template>


<script>
import { loadConnectionDetail, loadSubscriptions, unSubscription } from '@/api/connections'
import CreateSubscribe from './components/CreateSubscribe'

export default {
  name: 'ConnectionView',

  components: { CreateSubscribe },

  props: {},

  data() {
    return {
      dialogVisible: false,
      activeName: 'detail',
      searchValue: '',
      record: {
        clean_start: true,
        client_id: 'mqttjs_ccf2ae3e',
        conn_mod: 'emqx_channel',
        connected_at: '2019-07-01 12:11:48',
        heap_size: 987,
        ipaddress: '127.0.0.1',
        is_bridge: false,
        keepalive: 60,
        mailbox_len: 0,
        node: 'emqx@127.0.0.1',
        peercert: 'nossl',
        port: 60386,
        proto_name: 'MQTT',
        proto_ver: 4,
        recv_cnt: 98,
        recv_msg: 0,
        recv_oct: 223,
        recv_pkt: 98,
        reductions: 153061,
        send_cnt: 98,
        send_msg: 0,
        send_oct: 198,
        send_pend: 0,
        send_pkt: 98,
        username: 'undefined',
        zone: 'external',
        disconnected: false,
      },
      subscriptions: [],
    }
  },

  computed: {
    clientId() {
      return this.$route.query.client_id
    },
    connStatus() {
      return this.record.disconnected ? 'error' : 'success'
    },
    connStatusText() {
      return this.record.disconnected ? '已断开' : '在线'
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    handlePreAdd() {
      this.dialogVisible = true
    },
    async loadData() {
      if (!this.clientId) {
        return
      }
      this.record = await loadConnectionDetail(this.clientId)
      this.subscriptions = await loadSubscriptions(this.clientId)
    },
    handleTabClick() {
      this.loadData()
    },
    handleUnSubscription(row) {
      this.$msgbox.confirm('此操作将取消订阅该主题, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { topic, client_id } = row
        await unSubscription({ topic, client_id })
        this.loadData()
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss">
.connection-view {

  .field-title {
    width: 120px;
  }

  .detail-header {
    height: 120px;
    padding: 20px;
    background-color: #fff;
    position: relative;
    margin: -24px;
    margin-top: -28px;
    border: 1px solid #f0f2f5;
    margin-bottom: 24px;


    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #e8e8e8;
      z-index: 1;
    }

    .detail-header-title {
      display: flex;
      align-items: center;
      justify-items: left;

      .title-content {
        font-size: 18px;
        color: #000;
        font-weight: bolder;
        margin-left: 20px;
      }

      .title-status {
        margin-left: 20px;
        font-size: 14px;
      }

      .title-risk {
        font-size: 12px;
        margin-left: 3px;
        color: #808080;
      }
    }

    .detail-footer {
      padding: 0 20px;
      position: absolute;
      bottom: -14px;
      left: 20px;

      .el-tabs__item {
        font-weight: normal;
        color: #000;

        &.is-active {
          font-weight: 500;
          color: #000;
        }

        &:hover {
          color: #000;
        }
      }


      .el-tabs__active-bar {
        height: 3px;

      }
    }
  }

  .detail-card {
    margin-bottom: 24px;
  }

  .emq-title {
    margin-bottom: 40px;
  }

  .subscriptions-header {
    float: right;
  }

  .search-wrapper {
    width: 330px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-button {
      margin-left: 12px;
    }

    clear: both;
  }

  .data-list {
    clear: both;
  }
}
</style>
