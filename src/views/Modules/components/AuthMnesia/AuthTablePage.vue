<template>
  <div class="acl-table-page">
    <div class="emq-table-header">
      <div class="col-oper">
        <el-row class="search-bar" :gutter="20">
          <el-col :span="8">
            <el-input
              v-model="searchOpt[type]"
              size="small"
              :placeholder="$t(`Clients.${type}`)"
              @keyup.enter.native="loadData"
            />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" @click="loadData">
              {{ $t('Base.search') }}
            </el-button>
          </el-col>
        </el-row>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addAuth">
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" class="data-list" v-loading="listLoading">
      <el-table-column :prop="type" :label="$t(`Clients.${type}`)" />
      <el-table-column prop="oper" width="120px">
        <template slot-scope="{ row }">
          <el-button type="dashed" size="mini" @click="showEdit(row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button type="dashed danger" size="mini" @click="handleDelete(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <el-pagination
        v-if="count > 10"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 50, 100, 500]"
        :page-size.sync="pageParams._limit"
        :current-page.sync="pageParams._page"
        :total="count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      >
      </el-pagination>
    </div>
    <AuthDialog v-model="showDialog" :auth="currentAuth" :type="type" @submitted="loadData" />
  </div>
</template>

<script>
import { loadAuth, deleteAuth } from '@/api/modules'
import AuthDialog from './AuthDialog.vue'
import { checkNOmitFromObj } from '@/common/utils.js'

export default {
  name: 'AuthTablePage',

  components: { AuthDialog },

  props: {
    type: {
      type: String,
      default: 'username',
    },
  },

  data() {
    return {
      searchOpt: {
        username: '',
        clientid: '',
      },
      tableData: [],
      listLoading: false,
      pageParams: {
        _limit: 10,
        _page: 1,
      },
      count: 0,
      currentAuth: undefined,
      showDialog: false,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.listLoading = true
      const searchParams = checkNOmitFromObj({ [this.type]: this.searchOpt[this.type] })
      const data = await loadAuth(this.type, { ...this.pageParams, ...searchParams })
      const {
        items = [],
        meta: { count = 0 },
      } = data
      this.tableData = items
      this.count = count
      this.listLoading = false
    },
    handleSizeChange() {
      this.loadData()
    },
    handleCurrentPageChange() {
      this.loadData()
    },
    addAuth() {
      this.currentAuth = undefined
      this.showDialog = true
    },
    showEdit(auth) {
      this.currentAuth = auth
      this.showDialog = true
    },
    async handleDelete(row) {
      this.$confirm(this.$t('Modules.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let res
          if (this.type === 'clientid') {
            res = await deleteAuth(this.type, row.clientid)
          } else {
            res = await deleteAuth(this.type, row.username)
          }
          if (res) {
            this.loadData()
            this.$message.success(this.$t('Base.deleteSuccess'))
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.acl-table-page {
  .emq-table-header {
    padding-bottom: 3px;
  }

  .el-select {
    width: 100%;
  }
  .col-oper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 13px;
    margin-bottom: 16px;
    flex-grow: 1;
    .search-bar {
      width: 60%;
    }
    .el-button {
      margin-left: 12px;
    }
  }
  .search-bar {
    .el-button {
      height: 32px;
    }
  }
  .data-list {
    clear: both;
  }
}
</style>
