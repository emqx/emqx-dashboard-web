<template>
  <div class="clients">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Clients.currentConnection') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <div class="search-wrapper">
            <el-input v-model="searchValue" size="small" :placeholder="$t('Clients.clientId')"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
              {{ $t('Clients.search') }}
            </el-button>
            <el-button plain size="small" :icon="resetIcon" @click="resetSearch">
              {{ searchValue ? $t('Clients.reset') : $t('Clients.refresh') }}
            </el-button>
          </div>
          <div class="search-wrapper">
            <emq-select
              v-model="nodeName"
              class="node-select"
              size="small"
              :field="{ options: currentNodes }"
              :field-name="{ label: 'name', value: 'node' }"
              @change="handleNodeChange"
            ></emq-select>
          </div>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="clientid" min-width="130px" :label="$t('Clients.clientId')">
            <template slot-scope="{ row }">
              <router-link
                :to="{
                  path: '/clients/detail',
                  query: { clientid: row.clientid }
                }"
              >
                {{ row.clientid }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="username" min-width="120px" :label="$t('Clients.username')"></el-table-column>
          <el-table-column prop="ipaddress" min-width="120px" :label="$t('Clients.ipAddress')">
            <template slot-scope="{ row }">
              {{ row.ip_address }}:{{ row.port }}
            </template>
          </el-table-column>
          <el-table-column prop="keepalive" :label="$t('Clients.keepalive')"></el-table-column>
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
          <el-table-column prop="connected" min-width="100px" :label="$t('Clients.connectedStatus')">
            <template slot-scope="{ row }">
              <a-badge
                is-dot
                :status="row.connected ? 'success' : 'error'"
                :text="row.connected ? $t('Clients.connected') : $t('Clients.disconnected')"
              >
              </a-badge>
            </template>
          </el-table-column>
          <el-table-column prop="connected_at" min-width="140px" :label="$t('Clients.connectionAt')"></el-table-column>
          <el-table-column prop="oper" width="120px">
            <template slot-scope="{ row }">

              <el-button size="mini" type="dashed" @click="handleDisconnect(row)">
                {{ row.connected ? $t('Clients.kickOut') : $t('Clients.cleanSession') }}
              </el-button>

            </template>
          </el-table-column>
        </el-table>

        <div class="emq-table-footer">
          <el-pagination
            hide-on-single-page
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[20, 50, 100, 500]" :page-size.sync="params._limit"
            :current-page.sync="params._page" :total="count" @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
          >
          </el-pagination>
        </div>
      </a-card>
    </div>
  </div>
</template>


<script>
import {
  searchNodeClients, disconnectClient, listNodeClients,
} from '@/api/clients'
import { loadNodes } from '@/api/common'

export default {
  name: 'Clients',

  components: {},

  props: {},

  data() {
    return {
      popoverVisible: false,
      listLoading: true,
      tableData: [],
      searchValue: '',
      params: {
        _page: 1,
        _limit: 20,
      },
      count: 0,
      filterOptions: {
        protoName: ['MQTT', 'MQTT-SN', 'CoAP', 'LwM2M', 'Stomp'].map($ => ({ text: $, value: $ })),
      },
      nodeName: '',
      currentNodes: [],
      resetIcon: 'el-icon-refresh',
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    handleNodeChange() {
      this.searchValue = ''
      this.loadNodeClients(true)
    },
    async handleDisconnect(row) {
      let warningMsg = this.$t('Clients.willDisconnectTheConnection')
      let successMsg = this.$t('Clients.successfulDisconnection')
      if (!row.connected) {
        warningMsg = this.$t('Clients.willCleanSession')
        successMsg = this.$t('Clients.successfulCleanSession')
      }
      this.$msgbox.confirm(warningMsg, {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        await disconnectClient(row.clientid)
        this.loadNodeClients()
        this.$message.success(successMsg)
      }).catch(() => { })
    },
    resetSearch() {
      this.resetIcon = 'el-icon-loading'
      let reload = false
      if (this.searchValue) {
        reload = true
      }
      this.searchValue = ''
      this.loadNodeClients(reload)
    },
    async handleSearch() {
      const clientID = this.searchValue.trim()
      if (!clientID) {
        this.loadNodeClients()
        return
      }
      this.params._page = 1
      this.count = 0
      this.tableData = await searchNodeClients(this.nodeName, clientID)
    },
    handleSizeChange() {
      this.loadNodeClients(true)
    },
    handleCurrentPageChange() {
      this.loadNodeClients()
    },
    async loadData() {
      this.currentNodes = await loadNodes()
      this.nodeName = this.nodeName || (this.currentNodes[0] || {}).node
      this.listLoading = false
      this.loadNodeClients()
    },
    async loadNodeClients(reload, params = {}) {
      if (reload) {
        this.params._page = 1
      }
      const data = await listNodeClients(this.nodeName, { ...this.params, ...params })
      const { items = [], meta: { count = 0 } } = data
      this.tableData = items
      this.count = count
      this.resetIcon = 'el-icon-refresh'
    },
    protoNameColumnFilter(value, row) {
      return value === row.proto_name
    },
  },
}
</script>


<style lang="scss">
.clients {
  .data-list {
    clear: both;
  }
}
</style>
