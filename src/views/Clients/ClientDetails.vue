<template>
  <div class="client-details app-wrapper">
    <div class="section-header">
      <div>
        <span>{{ clientId }}</span>
        <el-tag type="info" size="mini">
          <span v-if="record.connected == true"
            ><i class="el-icon-success iconfont suc"></i>{{ $t('Clients.connected') }}</span
          >
          <span v-else
            ><i class="el-icon-error iconfont fail"></i>{{ $t('Clients.disconnected') }}</span
          >
        </el-tag>
        <el-tag type="info" size="mini" v-if="record.proto_name">
          <span>{{ record.proto_name }}</span
          >&nbsp;
          <span v-if="record.proto_name === 'MQTT'">{{ mqttVersion[record.proto_ver] }}</span
          ><span v-else>{{ record.proto_ver }}</span>
        </el-tag>
      </div>
      <div>
        <el-button
          v-if="record.connected"
          type="danger"
          plain
          size="small"
          @click="handleDisconnect"
        >
          {{ $t('Clients.kickOut') }}
        </el-button>
        <el-button v-else type="danger" size="small" plain @click="handleDisconnect">
          {{ $t('Clients.cleanSession') }}
        </el-button>
      </div>
    </div>

    <el-card shadow="never">
      <el-row>
        <div class="part-header">
          {{ $t('Clients.connectionInfo') }}
        </div>
        <el-row>
          <el-col v-for="item in clientsOrganizied.connection" :key="item" :span="8">
            <div v-if="item == 'protocol_type'" class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span
                v-if="record.proto_name === 'MQTT'"
                :title="record.proto_name + '&nbsp;' + mqttVersion[record.proto_ver]"
                >{{ record.proto_name }} {{ mqttVersion[record.proto_ver] }}</span
              >
              <span v-else :title="record.proto_name + '&nbsp;' + record.proto_ver"
                >{{ record.proto_name }} {{ record.proto_ver }}</span
              >
            </div>
            <div v-else class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="record[item]">{{ record[item] }}</span>
            </div>
          </el-col>
        </el-row>

        <div class="part-header">
          {{ $t('Clients.sessionInfo') }}
        </div>
        <el-row>
          <el-col v-for="item in clientsOrganizied.session" :key="item" :span="8">
            <div v-if="item == 'subscriptions_cnt'" class="detail-item">
              <span :title="tl('subscription')">{{ tl('subscription') }}:</span>
              <span
                :title="
                  record.subscriptions_cnt +
                  '/' +
                  (record.max_subscriptions === 0 ? 'Unlimited' : record.max_subscriptions)
                "
              >
                {{
                  record.subscriptions_cnt +
                  '/' +
                  (record.max_subscriptions === 0 ? 'Unlimited' : record.max_subscriptions)
                }}
              </span>
            </div>
            <div v-else-if="item == 'clean_start'" class="detail-item">
              <span :title="record.proto_ver === 5 ? 'Clean Start' : 'Clean Session'"
                >{{ record.proto_ver === 5 ? 'Clean Start' : 'Clean Session' }}:</span
              >
              <span :title="record[item]">{{ record[item] }}</span>
            </div>
            <div v-else-if="item == 'max_mqueue'" class="detail-item">
              <span :title="tl('mqueue')">{{ tl('mqueue') }}:</span>
              <span :title="record.mqueue_len + '/' + record.max_mqueue">{{
                record.mqueue_len + '/' + record.max_mqueue
              }}</span>
            </div>
            <div v-else-if="item == 'max_inflight'" class="detail-item">
              <span :title="tl('inflight')">{{ tl('inflight') }}:</span>
              <span :title="record.inflight + '/' + record.max_inflight">
                {{ record.inflight + '/' + record.max_inflight }}
              </span>
            </div>
            <div v-else class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="record[item]">{{ record[item] }}</span>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
    <div class="section-header">
      <div>
        {{ $t('Clients.currentSubscription') }}
      </div>
      <div>
        <!-- <el-button plain size="mini" icon="el-icon-refresh" @click="loadData">
          {{ $t('Clients.refresh') }}
        </el-button> -->
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handlePreAdd">
          {{ $t('Clients.addASubscription') }}
        </el-button>
      </div>
    </div>
    <el-table :data="subscriptions" class="data-list">
      <el-table-column prop="topic" show-overflow-tooltip label="Topic" sortable></el-table-column>
      <el-table-column prop="qos" sortable min-width="110px" label="QoS"></el-table-column>
      <el-table-column prop="node" sortable :label="$t('Clients.node')"></el-table-column>
      <el-table-column prop="clientid" :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button plain type="danger" size="mini" @click="handleUnSubscription(row)">
            {{ $t('Clients.unsubscribe') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <create-subscribe
      :visible.sync="dialogVisible"
      :client-id="record.clientid"
      @created="loadData"
    >
    </create-subscribe>
  </div>
</template>

<script>
import {
  loadClientDetail,
  loadSubscriptions,
  unSubscription,
  disconnectClient,
} from '@/api/clients'
import CreateSubscribe from './components/CreateSubscribe'

export default {
  name: 'ClientDetails',
  components: { CreateSubscribe },

  data() {
    return {
      dialogVisible: false,
      activeName: 'detail',
      searchValue: '',
      record: {},
      clientsOrganizied: {
        connection: [
          'node',
          'clientid',
          'username',
          'protocol_type',
          'ip_address',
          'port',
          'keepalive',
          'is_bridge',
          'connected_at',
          'disconnected_at',
          'zone',
          'recv_cnt',
          'recv_msg',
          'recv_oct',
          'recv_pkt',
        ],
        session: [
          'clean_start',
          'expiry_interval',
          'created_at',
          'subscriptions_cnt',
          'max_mqueue',
          'max_inflight',
          'heap_size',
          'reductions',
          'awaiting_rel',
          'max_awaiting_rel',
          'send_cnt',
          'send_msg',
          'send_oct',
          'send_pkt',
        ],
      },
      mqttVersion: {
        3: 'v3.1',
        4: 'v3.1.1',
        5: 'v5.0',
      },
      subscriptions: [],
    }
  },

  computed: {
    clientId() {
      return this.$route.params.clientId
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    snake2pascal(s) {
      return String(s).replace(/(_[a-z])/g, (m) => m.substring(1).toUpperCase())
    },
    tl(key, collection = 'Clients') {
      return this.$t(collection + '.' + key)
    },
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
            this.$router.push({ path: '/clients' })
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
      this.subscriptions = await loadSubscriptions(node, this.clientId)
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

<style lang="scss" scoped>
.client-details {
  .el-tag {
    margin-left: 10px;

    & i {
      font-size: 14px;
      margin-right: 3px;
      vertical-align: -1px;
    }

    & i.suc {
      color: #00b299ff;
    }
    & i.fail {
      color: #e34242ff;
    }
  }

  .detail-item {
    margin-top: 10px;
    color: #1d1d1dff;

    & span:first-child {
      color: #8d96a2ff;
      display: inline-block;
      width: 40%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    & span:last-child {
      display: inline-block;
      vertical-align: middle;
      width: 55%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
