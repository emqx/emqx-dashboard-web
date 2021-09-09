<template>
  <div class="client-details app-wrapper">
    <div class="section-header" v-loading.lock="clientDetailLock">
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

    <el-card shadow="never" v-loading.lock="clientDetailLock">
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
            <div
              v-else-if="item == 'connected_at' || item == 'disconnected_at'"
              class="detail-item"
            >
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="moment(record[item]).format('YYYY-MM-DD HH:mm:ss')">
                {{ moment(record[item]).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
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
            <div v-if="item == 'subscriptions'" class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="record.subscriptions_cnt + '/' + record.subscriptions_max">
                {{ record.subscriptions_cnt + '/' + record.subscriptions_max }}
              </span>
            </div>
            <div v-else-if="item == 'clean_start'" class="detail-item">
              <span :title="record.proto_ver === 5 ? 'Clean Start' : 'Clean Session'"
                >{{ record.proto_ver === 5 ? 'Clean Start' : 'Clean Session' }}:</span
              >
              <span :title="record[item]">{{ record[item] }}</span>
            </div>
            <div v-else-if="item == 'mqueue'" class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="record.mqueue_len + '/' + record.mqueue_max">{{
                record.mqueue_len + '/' + record.mqueue_max
              }}</span>
            </div>
            <div v-else-if="item == 'inflight'" class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="record.inflight_cnt + '/' + record.inflight_max">
                {{ record.inflight_cnt + '/' + record.inflight_max }}
              </span>
            </div>
            <div v-else-if="item == 'created_at'" class="detail-item">
              <span :title="tl(snake2pascal(item))">{{ tl(snake2pascal(item)) }}:</span>
              <span :title="moment(record[item]).format('YYYY-MM-DD HH:mm:ss')">
                {{ moment(record[item]).format('YYYY-MM-DD HH:mm:ss') }}
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
    <el-table :data="subscriptions" v-loading.lock="subsLockTable">
      <el-table-column prop="topic" show-overflow-tooltip label="Topic" sortable></el-table-column>
      <el-table-column prop="qos" sortable min-width="110px" label="QoS"></el-table-column>
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
      @create:subs="loadSubs"
    >
    </create-subscribe>

    <el-dialog
      :visible.sync="errDialog"
      :before-close="
        () => {
          this.$router.push({ path: '/clients' })
        }
      "
    >
      <span>{{ $t('Clients.clientDetailErr') }}</span>
    </el-dialog>
  </div>
</template>

<script>
import { loadClientDetail, loadSubscriptions, unsubscribe, disconnectClient } from '@/api/clients'
import CreateSubscribe from './components/CreateSubscribe'
import moment from 'moment'

export default {
  name: 'ClientDetails',
  components: { CreateSubscribe },

  data() {
    return {
      dialogVisible: false,
      activeName: 'detail',
      searchValue: '',
      clientDetailLock: true,
      subsLockTable: true,
      errDialog: false,
      record: {},
      clientsOrganizied: {
        connection: [
          'node',
          'clientid',
          'username',
          'protocol_type',
          'ip_address',
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
          'subscriptions',
          'mqueue',
          'inflight',
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
    this.loadSubs()
  },

  methods: {
    moment: moment,
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
          return disconnectClient(this.record.clientid)
        })
        .then(() => {
          this.$set(this.record, 'connected', false)
          this.$message.success(successMsg)
          this.$router.push({ path: '/clients' })
        })
        .catch(() => {})
    },
    handlePreAdd() {
      this.dialogVisible = true
    },
    async loadData() {
      this.record = await loadClientDetail(this.clientId).catch(() => {
        this.errDialog = true
        return {}
      })
      this.clientDetailLock = false
    },
    async loadSubs() {
      this.subsLockTable = true
      let res = await loadSubscriptions(this.clientId).catch(() => [])
      if (res) {
        this.subscriptions = res
      } else {
        this.subscriptions = []
      }
      this.subsLockTable = false
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
          const { clientid, topic } = row
          return unsubscribe(clientid, topic)
        })
        .then(() => {
          this.loadSubs()
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
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

.section-header::v-deep .el-loading-mask {
  margin-left: 0px;
}
</style>
