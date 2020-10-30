<template>
  <div class="lw-clients">
    <lw-client-details v-if="$route.query.imei"></lw-client-details>
    <a-card v-else class="emq-list-card">
      <div class="lw-clients-header">
        <div>
          {{ $t('Clients.currentConnection') }}<span class="current-clients">{{ connectedCount }}</span>
        </div>
        <el-col :span="8">
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
        <el-table-column prop="imei" label="imei">
          <template slot-scope="{ row }">
            <a @click="showClientDetails(row)">{{ row.imei }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="ip_address" :label="$t('Clients.ipAddress')"> </el-table-column>
        <el-table-column prop="port" :label="$t('Clients.port')"> </el-table-column>
        <el-table-column prop="lifetime" label="lifetime"> </el-table-column>
        <el-table-column prop="version" :label="$t('Schemas.version')"> </el-table-column>
        <el-table-column width="120px">
          <template slot-scope="{ row }">
            <el-button size="mini" type="dashed" @click="handleDisconnect(row)">
              {{ $t('Clients.kickOut') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </a-card>
  </div>
</template>

<script>
import LwClientDetails from './LwClientDetails'
import { matchSearch } from '@/common/utils'
import { getLwClients } from '@/api/modules'

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
    }
  },

  created() {
    this.loadList()
  },

  methods: {
    async loadList() {
      const data = await getLwClients()
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
    handleDisconnect() {},
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
  },
}
</script>

<style lang="scss">
.lw-clients {
  .lw-clients-header {
    margin-bottom: 24px;
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .current-clients {
      display: inline-block;
      color: #34c388;
      margin-left: 10px;
    }

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
