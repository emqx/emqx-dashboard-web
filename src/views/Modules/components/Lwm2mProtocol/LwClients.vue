<template>
  <div class="lw-clients">
    <lw-client-details v-if="$route.query.endpoint"></lw-client-details>
    <a-card v-else class="emq-list-card">
      <div class="lw-clients-header">
        <div>{{ $t('Clients.currentConnection') }}<span class="current-clients">1</span></div>
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
        <el-table-column prop="endpoint" label="Client Endpoint">
          <template slot-scope="{ row }">
            <a @click="showClientDetails(row)">{{ row.endpoint }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="keepalive" label="keepalive"> </el-table-column>
        <el-table-column prop="date" label="date"> </el-table-column>
        <el-table-column prop="update" label="update"> </el-table-column>
        <el-table-column prop="oper" width="120px">
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

export default {
  name: 'LwClients',

  components: {
    LwClientDetails,
  },

  data() {
    return {
      searchVal: '',
      searchLoading: false,
      showTableData: [
        {
          endpoint: 'client:d8aeba31',
          keepalive: '60',
        },
      ],
      tableData: [
        {
          endpoint: 'client:d8aeba31',
          keepalive: '60',
        },
      ],
    }
  },

  methods: {
    showClientDetails(row) {
      const { endpoint } = row
      this.$router.push({
        path: '/modules/manage',
        query: {
          type: 'lwm2m_protocol',
          endpoint,
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
        const res = await matchSearch(this.tableData, 'endpoint', this.searchVal)
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