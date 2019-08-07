<template>
  <div class="connection-view">
    <div class="page-header">
      <div class="page-header-content">

        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              {{ $t('Connections.homePage') }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/connections" tag="span" class="btn btn-default raw">
              {{ $t('Connections.connect') }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('Connections.connectionDetails') }}</a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div style="display: flex;align-items: center">
            <span class="title">
              {{ clientId }}
            </span>
            <a-badge :status="connStatus" :text="connStatusText"></a-badge>
          </div>
        </div>

        <el-tabs v-model="activeName" class="page-header-footer" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('Connections.basicInfo')" name="detail"></el-tab-pane>
          <el-tab-pane :label="$t('Connections.subscriptions')" name="subscriptions"></el-tab-pane>
        </el-tabs>

        <div v-if="!record.disconnected" class="page-header-top-start">
          <el-button type="danger" size="small" @click="handleDisconnect">{{ $t('Connections.disconnect') }}</el-button>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card v-if="activeName === 'detail'" class="detail-card">
        <el-row :gutter="40">
          <el-col :span="9">
            <div class="emq-title">
              {{ $t('Connections.connectionInfo') }}
            </div>

            <ul class="field-info">
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.accessPoint') }}:</div>
                <span class="field-value">{{ record.node }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">Client ID:</div>
                <span class="field-value">{{ record.client_id }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">Username:</div>
                <span class="field-value">{{ record.username }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.connectionAt') }}:</div>
                <span class="field-value">{{ record.connected_at }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">Address:</div>
                <span class="field-value">{{ record.ipaddress ? `${record.ipaddress}:` : '' }}{{ record.port }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">Clean Start:</div>
                <span class="field-value">{{ record.clean_start }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">keepalive:</div>
                <span class="field-value">{{ record.keepalive }}</span>
              </li>
            </ul>
          </el-col>
          <el-col :span="9">
            <div class="emq-title">
              {{ $t('Connections.protocolInfo') }}
            </div>

            <ul class="field-info">
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.bridge') }}:</div>
                <span class="field-value">{{ record.is_bridge ? $t('Connections.yes') : $t('Connections.no') }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.protocolType') }}:</div>
                <span class="field-value">{{ record.proto_name }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.protocolVersion') }}:</div>
                <span class="field-value">{{ record.proto_ver }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.sslCert') }}:</div>
                <span class="field-value">{{ record.peercert }}</span>
              </li>
              <li class="field-info-item">
                <div class="field-title">{{ $t('Connections.zone') }}:</div>
                <span class="field-value">{{ record.zone }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </a-card>


      <a-card v-if="activeName === 'subscriptions'">
        <div class="emq-title">
          {{ $t('Connections.currentSubscription') }}

          <div class="subscriptions-header">
            <el-button plain size="mini" icon="el-icon-refresh" @click="loadData">{{ $t('Connections.refresh') }}
            </el-button>
            <el-button plain size="mini" icon="el-icon-plus" @click="handlePreAdd">{{ $t('Connections.addASubscription')
            }}
            </el-button>
          </div>
        </div>


        <el-table :data="subscriptions" class="data-list">
          <el-table-column prop="topic" min-width="110px" show-overflow-tooltip label="Topic"></el-table-column>
          <el-table-column prop="qos" min-width="110px" label="QoS"></el-table-column>
          <el-table-column prop="node" min-width="80px" :label="$t('Connections.node')"></el-table-column>
          <el-table-column prop="client_id" width="100px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="handleUnSubscription(row)">
                {{ $t('Connections.unsubscribe') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </a-card>
    </div>

    <create-subscribe
      :visible.sync="dialogVisible"
      :client-id="record.client_id"
      @created="loadData"
    >
    </create-subscribe>

  </div>
</template>


<script>
import {
  loadConnectionDetail, loadSubscriptions, unSubscription, disconnectConnection,
} from '@/api/connections'
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
      return this.record.disconnected ? this.$t('Connections.disconnected') : this.$t('Connections.onLine')
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async handleDisconnect() {
      if (this.record.disconnected) {
        return
      }
      this.$msgbox.confirm(this.$t('Connections.willDisconnectTheConnection'), {
        confirmButtonText: this.$t('Connections.confirm'),
        cancelButtonText: this.$t('Connections.cancel'),
        type: 'warning',
      }).then(async () => {
        await disconnectConnection(this.record.client_id)
        this.$set(this.record, 'disconnected', true)
        this.$message.success(this.$t('Connections.successfulDisconnection'))
      }).catch(() => {})
    },
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
      const title = this.$t('Connections.unsubscribeTitle')
      console.log(this)
      this.$msgbox.confirm(
        title,
        {
          confirmButtonText: this.$t('Connections.confirm'),
          cancelButtonText: this.$t('Connections.cancel'),
          type: 'warning',
        },
      ).then(async () => {
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

  .page-header {
    height: 130px;
  }

  .page-header-footer {
    position: absolute;
    bottom: -14px;

    .el-tabs__item {
      font-weight: normal;

      &.is-active {
        font-weight: 500;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}
</style>
