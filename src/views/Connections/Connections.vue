<template>
  <div class="connections">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              {{ $t('Connections.homePage') }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ $t('Connections.connect') }}
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-content-view">
          <div class="content">
            {{ $t('Connections.currentConnection') }}
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <div class="search-wrapper">
            <el-input v-model="searchValue" size="small" placeholder="Client ID"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">{{ $t('Connections.search') }}</el-button>
            <el-button plain size="small" icon="el-icon-refresh" @click="resetSearch">
              {{ searchValue ? $t('Connections.reset') : $t('Connections.refresh') }}
            </el-button>
          </div>

          <!--<div>-->
          <!--<el-radio-group v-model="showLevel" size="mini" @change="syncShowLevel">-->
          <!--<el-radio-button label="simple">{{ $t('Connections.overview') }}</el-radio-button>-->
          <!--<el-radio-button label="more">{{ $t('Connections.detailed') }}</el-radio-button>-->
          <!--</el-radio-group>-->
          <!--</div>-->


        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="client_id" min-width="130px" label="Client ID">
            <template slot-scope="{ row }">
              <router-link :to="{ path: '/connections/detail', query: { client_id: row.client_id } }">
                {{ row.client_id }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="username" min-width="120px" label="Username"></el-table-column>
          <el-table-column v-if="showLevel === 'more'" prop="node" min-width="120px" :label="$t('Connections.accessPoint')"></el-table-column>
          <el-table-column prop="ipaddress" min-width="120px" label="Address">
            <template slot-scope="{ row }">
              {{ row.ipaddress }}:{{ row.port }}
            </template>
          </el-table-column>
          <el-table-column prop="keepalive" label="Keepalive"></el-table-column>
          <el-table-column prop="proto_name" :filters="filterOptions.protoName" :filter-method="protoNameColumnFilter"
                           filter-placement="bottom" :label="$t('Connections.protocol')"
          >
            <template slot-scope="{ row }">
              <span class="">
                {{ row.proto_name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="showLevel === 'more'" prop="proto_ver" min-width="80px" :label="$t('Connections.protocolVersion')"></el-table-column>
          <el-table-column v-if="showLevel === 'more'" prop="clean_start" min-width="80px" :label="$t('Connections.clearSession')"
                           :formatter="$ => $ ? 'true' : 'false'"
          ></el-table-column>
          <el-table-column v-if="showLevel === 'more'" prop="peercert" min-width="80px" :label="$t('Connections.SSL')"></el-table-column>


          <el-table-column prop="connected_at" min-width="140px" :label="$t('Connections.connectionAt')"></el-table-column>
          <el-table-column prop="oper" width="120px" label="">
            <template slot-scope="{ row }">

              <el-button size="mini" type="dashed" @click="handleDisconnect(row)">
                {{ row.disconnected ? $t('Connections.disconnected') : $t('Connections.disconnect') }}
              </el-button>

              <!--<el-button size="mini" type="danger">Ban</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <div class="emq-table-footer">
          <el-pagination
            hide-on-single-page background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[20, 50, 100, 500]" :page-size.sync="params._limit"
            :current-page.sync="params._page" :total="count" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </a-card>
    </div>
  </div>
</template>


<script>
import { listConnections, searchConnections, disconnectConnection } from '@/api/connections'

export default {
  name: 'Connections',

  components: {},

  props: {},

  data() {
    return {
      showLevel: 'simple', // localStorage.getItem('showLevel') || 'simple',
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
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    syncShowLevel() {
      localStorage.setItem('SHOW_LEVEL', this.showLevel)
    },
    async handleDisconnect(row) {
      if (row.disconnected) {
        return
      }
      this.$msgbox.confirm(this.$t('Connections.thisOperationWillDisconnectTheConnection'), {
        confirmButtonText: this.$t('Connections.confirm'),
        cancelButtonText: this.$t('Connections.cancel'),
        type: 'warning',
      }).then(async () => {
        await disconnectConnection(row.client_id)
        this.$set(row, 'disconnected', true)
        this.loadData()
        this.$message.success(this.$t('Connections.successfulDisconnection'))
      }).catch(() => { })
    },
    resetSearch() {
      if (this.searchValue) {
        this.params._page = 1
      }
      this.searchValue = ''
      this.loadData()
    },
    async handleSearch() {
      const clientID = this.searchValue.trim()
      if (!clientID) {
        this.loadData()
        return
      }
      this.params._page = 1
      this.count = 0
      this.tableData = await searchConnections(clientID)
    },
    handleSizeChange() {
      this.params._page = 1
      this.loadData()
    },
    handleCurrentChange() {
      this.loadData()
    },
    async loadData(params = {}) {
      this.listLoading = false
      const data = await listConnections({ ...this.params, ...params })
      const { items = [], meta: { count = 0 } } = data
      this.tableData = items
      this.count = count
    },
    protoNameColumnFilter(value, row) {
      return value === row.proto_name
    },
  },
}
</script>


<style lang="scss">
.connections {
  .search-wrapper {
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-button {
      margin-left: 12px;
    }
  }

  .data-list {
    clear: both;
  }

  .protocol-span {
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    background-color: #34c388;
    padding: 10px;
    font-size: 12px;
    color: #fff;
    display: inline-block;
  }
}
</style>
