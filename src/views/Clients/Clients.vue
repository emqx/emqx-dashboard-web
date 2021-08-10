<template>
  <div class="app-wrapper clients">
    <el-row class="search-wrapper" :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="fuzzyParams._like_clientid"
          size="small"
          :placeholder="$t('Clients.clientId')"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="fuzzyParams._like_username"
          size="small"
          :placeholder="$t('Clients.username')"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="nodeName" :placeholder="$t('Clients.node')" size="small">
          <el-option v-for="item in currentNodes" :value="item.node" :key="item.node"></el-option>
        </el-select>
      </el-col>
      <template v-if="showMoreQuery">
        <el-col :span="6">
          <el-input
            v-model="fuzzyParams.ip_address"
            size="small"
            :placeholder="$t('Clients.ipAddress')"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="fuzzyParams.conn_state"
            size="small"
            :placeholder="$t('Clients.connectedStatus')"
          >
            <el-option value="connected"></el-option>
            <el-option value="disconnected"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-row class="form-item-row">
            <el-col :span="8">
              <el-select v-model="fuzzyParams.comparator" class="comparator" size="small">
                <el-option label=">=" value="_gte"></el-option>
                <el-option label="<=" value="_lte"></el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              <el-date-picker
                v-model="fuzzyParams._connected_at"
                class="datatime"
                type="datetime"
                value-format="timestamp"
                size="small"
                :placeholder="$t('Clients.createdAt')"
              >
              </el-date-picker>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="fuzzyParams.proto_name"
            size="small"
            :placeholder="$t('Clients.protocol')"
          >
            <el-option v-for="name in protoNames" :key="name" :value="name"> </el-option>
          </el-select>
        </el-col>
      </template>
      <el-col :span="6" class="col-oper">
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
          {{ $t('Clients.search') }}
        </el-button>

        <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
          <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </a>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      :row-class-name="getRowClass"
      @select="clientSelect"
      @select-all="clientSelectAll"
      @row-click="handleRowClick"
      ref="clientsTable"
      v-loading.lock="lockTable"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column prop="clientid" sortable :label="$t('Clients.clientId')">
        <template slot-scope="{ row }">
          <router-link
            :to="{
              name: 'clients-detail',
              params: { clientId: row.clientid },
            }"
          >
            {{ row.clientid }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column prop="username" sortable :label="$t('Clients.username')"></el-table-column>
      <el-table-column prop="ip_address" sortable :label="$t('Clients.ipAddress')">
        <!-- <template slot-scope="{ row }"> {{ row.ip_address }}:{{ row.port }} </template> -->
      </el-table-column>
      <el-table-column prop="keepalive" sortable :label="$t('Clients.keepalive')"></el-table-column>
      <el-table-column prop="proto_name" sortable :label="$t('Clients.protocol')">
        <template slot-scope="{ row }">
          <span class="">
            {{ row.proto_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="connected" sortable :label="$t('Clients.connectedStatus')">
        <template slot-scope="{ row }">
          <el-badge is-dot :type="row.connected ? 'success' : 'danger'"> </el-badge>
          <span>{{ row.connected ? $t('Clients.connected') : $t('Clients.disconnected') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="connected_at" sortable :label="$t('Clients.connectedAt')">
        <template #default="{ row }">
          {{ moment(row.connected_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button size="mini" type="danger" plain @click="handleDisconnect(row)">
            {{ row.connected ? $t('Clients.kickOut') : $t('Clients.cleanSession') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <!-- <el-pagination
        v-if="count > 0"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="params.limit"
        :current-page.sync="params.page"
        :total="count"
        @size-change="
          () => {
            this.loadNodeClients(true)
          }
        "
        @current-change="loadNodeClients"
      >
      </el-pagination> -->
      <common-pagination :count="count" :reload-func="loadNodeClients"></common-pagination>
      <!-- <custom-pagination
        v-if="count === -1 && tableData.length"
        :hasnext="hasnext"
        :page="params.page"
        @prevClick="handlePrevClick"
        @nextClick="handleNextClick"
      >
      </custom-pagination> -->
    </div>
  </div>
</template>

<script>
import CustomPagination from '@/components/CustomPagination.vue'
import { disconnectClient, listNodeClients } from '@/api/clients'
import { loadNodes } from '@/api/common'
import moment from 'moment'
import CommonPagination from '../../components/commonPagination.vue'

export default {
  name: 'Clients',

  components: {
    // CustomPagination,
    CommonPagination,
  },
  data() {
    return {
      showMoreQuery: false,
      tableData: [],
      lockTable: true,
      hasnext: false,
      params: {
        //   page: 1,
        //   limit: 20,
      },
      count: 0,
      nodeName: '',
      currentNodes: [],
      fuzzyParams: {
        comparator: '_gte',
      },
      selectedClients: [],
      protoNames: ['MQTT', 'MQTT-SN', 'CoAP', 'LwM2M'],
      qulifiedKeys: [
        'awaiting_rel',
        'clean_start',
        'clientid',
        'connected',
        'connected_at',
        'created_at',
        'expiry_interval',
        'heap_size',
        'inflight',
        'ip_address',
        'is_bridge',
        'keepalive',
        'mailbox_len',
        'max_awaiting_rel',
        'max_inflight',
        'max_mqueue',
        'max_subscriptions',
        'mountpoint',
        'mqueue_dropped',
        'mqueue_len',
        'node',
        'port',
        'proto_name',
        'proto_ver',
        'recv_cnt',
        'recv_msg',
        'recv_oct',
        'recv_pkt',
        'reductions',
        'send_cnt',
        'send_msg',
        'send_oct',
        'send_pkt',
        'subscriptions_cnt',
        'username',
        'zone',
      ],
    }
  },

  created() {
    this.loadData()
    // this.loadNodeClients()
  },

  methods: {
    moment: moment,
    handleRowClick(row, column, event) {
      // console.log(row, event)
      //shiftkey+mouse select all rows before the selected one
      if (event.shiftKey) {
        let rowIndex = this.tableData.findIndex((e) => e == row)
        for (let x = rowIndex, y = 0; x > y; x--) {
          if (this.tableData[x].selection) break
          this.$refs.clientsTable.toggleRowSelection(this.tableData[x], true)
          this.tableData[x].selection = true
        }
      }
      // else {
      //   this.$refs.clientsTable.toggleRowSelection(row, !row.selection)
      //   row.selection = !row.selection
      // }
    },
    clientSelectAll(sel) {
      this.selectedClients = sel
      sel.length
        ? sel.forEach((row) => (row.selection = true))
        : this.tableData.forEach((row) => (row.selection = false))
    },
    clientSelect(selection, row) {
      row.selection = selection.includes(row)
      this.selectedClients = selection
    },
    getRowClass({ row, rowIndex }) {
      if (row.selection == true) {
        return 'row_selected'
      }
    },
    async handleDisconnect(row) {
      let warningMsg = this.$t('Clients.willDisconnectTheConnection')
      let successMsg = this.$t('Clients.successfulDisconnection')
      if (!row.connected) {
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
          await disconnectClient(row.clientid)
          this.loadNodeClients()
          this.$message.success(successMsg)
        })
        .catch(() => {})
    },

    async handleSearch() {
      this.params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeClients()
    },
    genQueryParams(params) {
      let newParams = {}
      const {
        like_clientid,
        like_username,
        ip_address,
        conn_state,
        proto_name,
        comparator,
        _connected_at,
      } = params
      newParams = {
        like_clientid: like_clientid || undefined,
        like_username: like_username || undefined,
        ip_address: ip_address || undefined,
        conn_state: conn_state || undefined,
        proto_name: proto_name || undefined,
      }
      if (_connected_at) {
        const connectedAtKey = `${comparator}_connected_at`
        newParams[connectedAtKey] = Math.floor(_connected_at / 1000)
      }
      return newParams
    },
    // handlePrevClick() {
    //   if (this.params.page === 1) {
    //     return
    //   }
    //   this.params.page -= 1
    //   const params = this.genQueryParams(this.fuzzyParams)
    //   this.loadNodeClients(false, params)
    // },
    // handleNextClick() {
    //   if (!this.hasnext) {
    //     return
    //   }
    //   this.params.page += 1
    //   const params = this.genQueryParams(this.fuzzyParams)
    //   this.loadNodeClients(false, params)
    // },
    async loadData() {
      const data = await loadNodes().catch(() => {})
      if (data) this.currentNodes = data
    },
    async loadNodeClients(params = {}) {
      // if (reload) {
      //   this.params.page = 1
      // }
      this.lockTable = true

      const res = await listNodeClients(this.nodeName, {
        ...this.params,
        ...params,
      }).catch(() => {})
      if (res) {
        const { data = [], meta = {} } = res
        this.tableData = data
        this.count = meta.count || this.count
        // this.hasnext = meta.hasnext || this.hasnext
      } else {
        this.tableData = []
        this.count = 0
      }
      this.lockTable = false
    },
  },
}
</script>

<style lang="scss" scoped>
.show-more {
  margin-left: 12px;
}
</style>
