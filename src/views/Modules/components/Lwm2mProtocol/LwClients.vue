<template>
  <div class="lw-clients clients">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          <div>
            {{ $t('Clients.currentConnection') }}:<span class="current-clients">{{ connectedCount }}</span>
          </div>
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
    </page-header>
    <lw-client-details v-if="$route.query.imei" :nodeName="nodeName"></lw-client-details>
    <el-card shadow="never" v-else class="emq-list-card">
      <div class="lw-clients-header">
        <el-col :span="8" :offset="16">
          <el-input
            v-model="searchVal"
            type="text"
            class="search-input"
            size="small"
            clearable
            :placeholder="$t('Modules.searchClient')"
            @input="searchClient"
          >
            <i v-if="!searchLoading" slot="prefix" class="el-icon-search"></i>
            <i v-else slot="prefix" class="el-icon-loading"></i>
          </el-input>
        </el-col>
      </div>
      <el-table :data="showTableData">
        <el-table-column prop="imei" label="IMEI">
          <template slot-scope="{ row }">
            <a @click="showClientDetails(row)">{{ row.imei }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="ip_address" :label="$t('Clients.ipAddress')"> </el-table-column>
        <el-table-column prop="port" :label="$t('Clients.port')"> </el-table-column>
        <el-table-column prop="lifetime" label="LifeTime"> </el-table-column>
        <el-table-column prop="version" :label="$t('Schemas.version')"> </el-table-column>
        <el-table-column width="120px">
          <template slot-scope="{ row }">
            <el-button size="mini" type="dashed" @click="handleDisconnect(row)">
              {{ $t('Clients.kickOut') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import LwClientDetails from './LwClientDetails'
import { matchSearch } from '@/common/utils'
import { loadNodes } from '@/api/common'
import { getLwClients } from '@/api/modules'
import { disconnectClient } from '@/api/clients'

export default {
  name: 'LwClients',

  components: {
    LwClientDetails,
  },

  data() {
    return {
      searchVal: '',
      searchLoading: false,
      showTableData: [],
      tableData: [],
      connectedCount: 0,
      nodeName: '',
      currentNodes: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.currentNodes = await loadNodes()
      this.nodeName = this.nodeName || (this.currentNodes[0] || {}).node
      this.listLoading = false
      this.loadClientList()
    },
    async loadClientList() {
      const data = await getLwClients(this.nodeName)
      this.tableData = data
      this.showTableData = data
      this.connectedCount = data.length
    },
    showClientDetails(row) {
      const { imei } = row
      this.$router.push({
        path: '/modules/manage',
        query: {
          type: 'lwm2m_protocol',
          imei,
        },
      })
    },
    async handleDisconnect(row) {
      const warningMsg = this.$t('Clients.willDisconnectTheConnection')
      const successMsg = this.$t('Clients.successfulDisconnection')
      this.$msgbox
        .confirm(warningMsg, {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await disconnectClient(row.imei)
          this.$message.success(successMsg)
          setTimeout(() => {
            this.loadClientList()
          }, 500)
        })
        .catch(() => {})
    },
    searchClient() {
      this.searchLoading = true
      if (this.searchVal === '') {
        this.showTableData = this.tableData
        this.searchLoading = false
        return
      }
      setTimeout(async () => {
        const res = await matchSearch(this.tableData, 'imei', this.searchVal)
        if (res) {
          this.showTableData = res
          this.searchLoading = false
        } else {
          this.searchLoading = false
        }
      }, 500)
    },
    handleNodeChange() {
      this.loadClientList()
    },
  },
}
</script>

<style lang="scss">
.lw-clients {
  .page-header {
    margin: 0 0 20px 0;
    .current-clients {
      display: inline-block;
      color: #34c388;
      margin-left: 10px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .lw-clients-header {
    margin-bottom: 24px;
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-input {
      .el-icon-search,
      .el-icon-loading {
        position: relative;
        left: 4px;
        top: 7px;
      }
    }
  }
}
</style>
