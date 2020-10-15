<template>
  <div class="client-details">
    <page-header>
      <div class="page-header-title-view">
        <div style="display: flex; align-items: center;">
          <span class="title">
            {{ clientId }}
          </span>
          <a-badge :status="connStatus" :text="connStatusText"></a-badge>
        </div>
      </div>

      <div class="page-header-top-start btn">
        <el-button v-if="record.connected" type="danger" size="small" @click="handleDisconnect">
          {{ $t('Clients.cleanSession') }}
        </el-button>
      </div>
    </page-header>

    <div class="app-wrapper">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('Clients.basicInfo')" name="detail">
          <a-card v-if="activeName === 'detail'" class="detail-card">
            <el-row :gutter="40">
              <el-col :span="12">
                <div class="emq-title">
                  {{ $t('Clients.connectionInfo') }}
                </div>

                <ul class="field-info connection">
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.accessNode') }}:</div>
                    <span class="field-value">{{ record.node }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.clientId') }}</div>
                    <span class="field-value">{{ record.clientid }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.username') }}:</div>
                    <span class="field-value">{{ record.username }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.protocolType') }}:</div>
                    <template v-if="record.proto_name === 'MQTT'">
                      <span class="field-value">{{ record.proto_name }} {{ mqttVersionMap[record.proto_ver] }}</span>
                    </template>
                    <template v-else>
                      <span class="field-value"
                        >{{ record.proto_name }}
                        <span v-if="record.proto_ver"> v{{ record.proto_ver }}</span>
                      </span>
                    </template>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.ipAddress') }}:</div>
                    <span class="field-value">{{ record.ip_address }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.port') }}:</div>
                    <span class="field-value">{{ record.port }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.keepalive') }}:</div>
                    <span class="field-value">{{ record.keepalive }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.bridge') }}:</div>
                    <span class="field-value">{{ record.is_bridge }}</span>
                  </li>
                  <li v-if="record.connected" class="field-info-item">
                    <div class="field-title">{{ $t('Clients.connectionAt') }}:</div>
                    <span class="field-value">{{ record.connected_at }}</span>
                  </li>
                  <li v-else class="field-info-item">
                    <div class="field-title">{{ $t('Clients.disConnectionAt') }}:</div>
                    <span class="field-value">{{ record.disconnected_at }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.zone') }}:</div>
                    <span class="field-value">{{ record.zone }}</span>
                  </li>
                </ul>
              </el-col>
              <el-col :span="12">
                <div class="emq-title">
                  {{ $t('Clients.sessionInfo') }}
                </div>

                <ul class="field-info session">
                  <li class="field-info-item">
                    <div class="field-title">{{ record.proto_ver === 5 ? 'Clean Start' : 'Clean Session' }}:</div>
                    <span class="field-value">{{ record.clean_start }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.expiryInterval') }}:</div>
                    <span class="field-value">{{ record.expiry_interval }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.createdAt') }}:</div>
                    <span class="field-value">{{ record.created_at }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.subscription') }}:</div>
                    <span> {{ record.subscriptions_cnt }} / {{ record.max_subscriptions | transToUnlimit }} </span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.mqueue') }}:</div>
                    <span>{{ record.mqueue_len }} / {{ record.max_mqueue }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.inflight') }}:</div>
                    <span> {{ record.inflight }} / {{ record.max_inflight }} </span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.heapSize') }}:</div>
                    <span>{{ record.heap_size }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.reductions') }}:</div>
                    <span>{{ record.reductions }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.awaiting_rel') }}:</div>
                    <span>{{ record.awaiting_rel }}</span>
                  </li>
                  <li class="field-info-item">
                    <div class="field-title">{{ $t('Clients.max_awaiting_rel') }}</div>
                    <span>{{ record.max_awaiting_rel }}</span>
                  </li>
                </ul>
              </el-col>
            </el-row>

            <div class="view-more">
              <a href="javascript:;" @click="showMore = !showMore">
                {{ showMore ? $t('Base.collapse') : $t('Base.viewMore') }}
                <i :class="showMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </a>
            </div>

            <el-collapse-transition>
              <el-row v-if="showMore" :gutter="40">
                <el-col :span="12">
                  <ul class="field-info more-info">
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.recv_cnt_desc') }}:</div>
                      <span>{{ record.recv_cnt }}</span>
                    </li>
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.recv_msg_desc') }}:</div>
                      <span>{{ record.recv_msg }}</span>
                    </li>
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.recv_oct_desc') }}:</div>
                      <span>{{ record.recv_oct }}</span>
                    </li>
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.recv_pkt_desc') }}:</div>
                      <span>{{ record.recv_pkt }}</span>
                    </li>
                  </ul>
                </el-col>
                <el-col :span="12">
                  <ul class="field-info more-info">
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.send_cnt_desc') }}:</div>
                      <span>{{ record.send_cnt }}</span>
                    </li>
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.send_msg_desc') }}:</div>
                      <span>{{ record.send_msg }}</span>
                    </li>
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.send_oct_desc') }}:</div>
                      <span>{{ record.send_oct }}</span>
                    </li>
                    <li class="field-info-item">
                      <div class="field-title">{{ $t('Clients.send_pkt_desc') }}:</div>
                      <span>{{ record.send_pkt }}</span>
                    </li>
                  </ul>
                </el-col>
              </el-row>
            </el-collapse-transition>
          </a-card>
        </el-tab-pane>

        <el-tab-pane :label="$t('Clients.subscriptions')" name="subscriptions">
          <a-card v-if="activeName === 'subscriptions'">
            <div class="emq-title">
              {{ $t('Clients.currentSubscription') }}
              <div class="subscriptions-header">
                <el-button plain size="mini" icon="el-icon-refresh" @click="loadData">
                  {{ $t('Clients.refresh') }}
                </el-button>
                <el-button plain size="mini" icon="el-icon-plus" @click="handlePreAdd">
                  {{ $t('Clients.addASubscription') }}
                </el-button>
              </div>
            </div>
            <el-table :data="subscriptions" class="data-list">
              <el-table-column prop="topic" min-width="110px" show-overflow-tooltip label="Topic"></el-table-column>
              <el-table-column prop="qos" min-width="110px" label="QoS"></el-table-column>
              <el-table-column prop="node" min-width="80px" :label="$t('Clients.node')"></el-table-column>
              <el-table-column prop="clientid" width="100px">
                <template slot-scope="{ row }">
                  <el-button type="dashed" size="mini" @click="handleUnSubscription(row)">
                    {{ $t('Clients.unsubscribe') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </a-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <create-subscribe :visible.sync="dialogVisible" :client-id="record.clientid" @created="loadData">
    </create-subscribe>
  </div>
</template>

<script>
import { loadClientDetail, loadSubscriptions, unSubscription, disconnectClient } from '@/api/clients'
import CreateSubscribe from './components/CreateSubscribe'

export default {
  name: 'ClientDetails',

  components: { CreateSubscribe },

  filters: {
    transToUnlimit(val) {
      return val === 0 ? 'Unlimited' : val
    },
  },

  props: {},

  data() {
    return {
      dialogVisible: false,
      showMore: false,
      activeName: 'detail',
      searchValue: '',
      record: {
        clean_start: true,
        clientid: 'mqttjs_ccf2ae3e',
        conn_mod: 'emqx_channel',
        connected_at: '2019-07-01 12:11:48',
        heap_size: 987,
        ip_address: '127.0.0.1',
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
        connected: false,
      },
      mqttVersionMap: {
        3: 'v3.1',
        4: 'v3.1.1',
        5: 'v5.0',
      },
      subscriptions: [],
    }
  },

  computed: {
    clientId() {
      return this.$route.query.clientid
    },
    connStatus() {
      return !this.record.connected ? 'error' : 'success'
    },
    connStatusText() {
      return !this.record.connected ? this.$t('Clients.disconnected') : this.$t('Clients.onLine')
    },
  },

  watch: {
    $route() {
      this.loadData()
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async handleDisconnect() {
      let warningMsg = this.$t('Clients.willDisconnectTheConnection')
      let successMsg = this.$t('Clients.successfulDisconnection')
      if (!this.record.connected) {
        warningMsg = this.$t('Clients.willCleanSession')
        successMsg = this.$t('Clients.successfulCleanSession')
      }
      this.$msgbox
        .confirm(warningMsg, {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await disconnectClient(this.record.clientid)
          this.$set(this.record, 'connected', false)
          this.$message.success(successMsg)
          setTimeout(() => {
            this.$router.push({ path: `/products/view?id=${this.$route.query.id}&tab=clients` })
          }, 500)
        })
        .catch(() => {})
    },
    handlePreAdd() {
      this.dialogVisible = true
    },
    async loadData() {
      if (!this.clientId) {
        return
      }
      this.record = await loadClientDetail(this.clientId)
      const { node } = this.record
      if (node) {
        this.subscriptions = await loadSubscriptions(node, this.clientId)
      }
    },
    handleTabClick() {
      this.loadData()
    },
    handleUnSubscription(row) {
      const title = this.$t('Clients.unsubscribeTitle')
      this.$msgbox
        .confirm(title, {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          const { topic, clientid } = row
          await unSubscription({ topic, clientid })
          this.loadData()
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.client-details {
  .connection .field-title {
    min-width: 120px;
  }
  .session .field-title {
    min-width: 160px;
  }

  .detail-card {
    margin-bottom: 24px;
  }

  .emq-title {
    margin-bottom: 28px;
  }

  .field-info-item {
    margin-bottom: 5px;
  }

  .subscriptions-header {
    float: right;
  }

  .data-list {
    clear: both;
  }

  .view-more {
    margin: 20px 0 0 0;
  }

  .more-info {
    margin-top: 20px;
  }
}
</style>
