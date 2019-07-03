<template>
  <div class="connections">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              首页
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            连接
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            连接
          </div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            当前在线设备连接
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <div></div>
          <div class="search-wrapper">
            <el-input v-model="searchValue" size="small" placeholder="输入 client id"></el-input>
            <el-button type="primary" size="small" @click="handleSearch">搜 索</el-button>
            <el-button plain size="small" @click="resetSearch">
              {{ searchValue ? '重 置' : '刷 新' }}
            </el-button>
          </div>

        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="client_id" min-width="110px" label="Client ID">
            <template slot-scope="{ row }">
              <router-link :to="{ path: '/connections/detail', query: { client_id: row.client_id } }">
                {{ row.client_id }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="username" label="Username"></el-table-column>
          <el-table-column prop="ipaddress" min-width="120px" label="Address">
            <template slot-scope="{ row }">
              {{ row.ipaddress }}:{{ row.port }}
            </template>
          </el-table-column>
          <el-table-column prop="keepalive" label="keepalive"></el-table-column>
          <el-table-column prop="proto_name" :filters="filterOptions.protoName" :filter-method="protoNameColumnFilter"
                           filter-placement="bottom" label="接入协议">
            <template slot-scope="{ row }">
              <span class="">
                {{ row.proto_name }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="connected_at" min-width="120px" label="连接时间"></el-table-column>
          <el-table-column prop="oper" width="120px" label="">
            <template slot-scope="{ row }">

              <el-button size="mini" type="dashed" @click="handleDisconnect(row)">
                {{ row.disconnected ? '已断开' : '断 开' }}
              </el-button>

              <!--<el-button size="mini" type="danger">Ban</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <div class="emq-table-footer">
          <el-pagination hide-on-single-page background layout="total, sizes, prev, pager, next"
                         :page-sizes="[20, 50, 100, 500]" :page-size.sync="params._limit"
                         :current-page.sync="params._page" :total="count" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
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
    async handleDisconnect(row) {
      if (row.disconnected) {
        return
      }
      this.$msgbox.confirm('此操作将断开该连接, 连接可能通过重连机制再次重连, 确认继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await disconnectConnection(row.client_id)
        this.$set(row, 'disconnected', true)
        this.$message.success('断开成功')
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
    width: 330px;
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
