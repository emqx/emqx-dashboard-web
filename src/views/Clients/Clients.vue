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
        <emq-select
          v-model="nodeName"
          class="node-select"
          size="small"
          :field="{ options: currentNodes }"
          :field-name="{ label: 'name', value: 'node' }"
          @change="handleNodeChange"
        ></emq-select>
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
        <el-button plain size="small" :icon="resetIcon" @click="resetSearch">
          {{ $t('Clients.reset') }}
        </el-button>
        <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
          <!-- {{ showMoreQuery ? $t('Clients.collapse') : $t('Clients.expand') }} -->
          <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </a>
      </el-col>
    </el-row>

    <el-table :data="tableData">
      <el-table-column prop="clientid" sortable :label="$t('Clients.clientId')">
        <template slot-scope="{ row }">
          <router-link
            :to="{
              path: '/clients/detail',
              query: { clientid: row.clientid },
            }"
          >
            {{ row.clientid }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column prop="username" sortable :label="$t('Clients.username')"></el-table-column>
      <el-table-column prop="ipaddress" sortable :label="$t('Clients.ipAddress')">
        <template slot-scope="{ row }"> {{ row.ip_address }}:{{ row.port }} </template>
      </el-table-column>
      <el-table-column prop="keepalive" sortable :label="$t('Clients.keepalive')"></el-table-column>
      <el-table-column
        prop="proto_name"
        filter-placement="bottom"
        :filters="filterOptions.protoName"
        :filter-method="protoNameColumnFilter"
        :label="$t('Clients.protocol')"
      >
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
      <el-table-column
        prop="connected_at"
        sortable
        :label="$t('Clients.connectionAt')"
      ></el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button size="mini" type="danger" plain @click="handleDisconnect(row)">
            {{ row.connected ? $t('Clients.kickOut') : $t('Clients.cleanSession') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="emq-table-footer">
      <el-pagination
        v-if="count > 10"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="params._limit"
        :current-page.sync="params._page"
        :total="count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      >
      </el-pagination>
      <custom-pagination
        v-if="count === -1 && tableData.length"
        :hasnext="hasnext"
        :page="params._page"
        @prevClick="handlePrevClick"
        @nextClick="handleNextClick"
      >
      </custom-pagination>
    </div>
  </div>
</template>

<script>
import CustomPagination from '@/components/CustomPagination.vue'
import { disconnectClient, listNodeClients } from '@/api/clients'
import { loadNodes } from '@/api/common'

export default {
  name: 'Clients',

  components: {
    CustomPagination,
  },

  data() {
    return {
      showMoreQuery: false,
      tableData: [],
      hasnext: false,
      params: {
        _page: 1,
        _limit: 20,
      },
      count: 0,
      filterOptions: {
        protoName: ['MQTT', 'MQTT-SN', 'CoAP', 'LwM2M', 'Stomp'].map(($) => ({
          text: $,
          value: $,
        })),
      },
      nodeName: '',
      currentNodes: [{ name: this.$t('RuleEngine.allNodes'), node: 'all' }],
      resetIcon: 'el-icon-refresh',
      fuzzyParams: {
        comparator: '_gte',
      },
      protoNames: ['MQTT', 'MQTT-SN', 'CoAP', 'LwM2M'],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    handleNodeChange() {
      this.loadNodeClients(true)
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
    resetSearch() {
      this.resetIcon = 'el-icon-loading'
      this.fuzzyParams = {
        comparator: '_gte',
      }
      this.loadNodeClients(true)
    },
    async handleSearch() {
      const params = this.genQueryParams(this.fuzzyParams)
      this.count = 0
      this.loadNodeClients(true, params)
    },
    genQueryParams(params) {
      let newParams = {}
      const {
        _like_clientid,
        _like_username,
        ip_address,
        conn_state,
        proto_name,
        comparator,
        _connected_at,
      } = params
      newParams = {
        _like_clientid: _like_clientid || undefined,
        _like_username: _like_username || undefined,
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
    handleSizeChange() {
      this.loadNodeClients(true)
    },
    handleCurrentPageChange() {
      this.loadNodeClients()
    },
    handlePrevClick() {
      if (this.params._page === 1) {
        return
      }
      this.params._page -= 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeClients(false, params)
    },
    handleNextClick() {
      if (!this.hasnext) {
        return
      }
      this.params._page += 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadNodeClients(false, params)
    },
    async loadData() {
      const data = await loadNodes()
      this.currentNodes = this.currentNodes.concat(data)
      this.nodeName = this.nodeName || (this.currentNodes[0] || {}).node
      this.loadNodeClients()
    },
    async loadNodeClients(reload, params = {}) {
      if (reload) {
        this.params._page = 1
      }
      const data = await listNodeClients(this.nodeName, {
        ...this.params,
        ...params,
      })
      const {
        items = [],
        meta: { count = 0, hasnext = false },
      } = data
      this.tableData = items
      this.count = count
      this.hasnext = hasnext
      this.resetIcon = 'el-icon-refresh'
    },
    protoNameColumnFilter(value, row) {
      return value === row.proto_name
    },
  },
}
</script>

<style lang="scss" scoped>
.show-more {
  margin-left: 12px;
  text-decoration: none;
}

.el-badge {
  height: 20px;
}
</style>
