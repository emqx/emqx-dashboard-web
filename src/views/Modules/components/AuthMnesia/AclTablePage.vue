<template>
  <div class="acl-table-page">
    <div class="emq-table-header">
      <div class="col-oper">
        <el-row class="search-bar" :gutter="20">
          <el-col :span="8">
            <el-input
              v-if="type !== '$all'"
              v-model="searchOpt[type]"
              size="small"
              :placeholder="$t(`Clients.${type}`)"
              @keyup.enter.native="initPageNLoad"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="searchOpt.topic"
              size="small"
              :placeholder="$t('Topics.topic') + $t('Modules.onlySupportsExactSearch')"
              @keyup.enter.native="initPageNLoad"
            />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" @click="initPageNLoad">
              {{ $t('Base.search') }}
            </el-button>
          </el-col>
        </el-row>
        <el-button type="primary" icon="el-icon-plus" size="small" :disabled="notAbleChange" @click="addACL">
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" class="data-list" v-loading="listLoading">
      <el-table-column v-if="type !== '$all'" :prop="type" :label="$t(`Clients.${type}`)"> </el-table-column>
      <el-table-column prop="topic" :label="$t('Topics.topic')"> </el-table-column>
      <el-table-column prop="action" :label="$t('Modules.action')"> </el-table-column>
      <el-table-column prop="access" :label="$t('Modules.isAllow')">
        <template slot-scope="{ row }">
          {{ row.access === 'allow' ? $t('Modules.allow') : $t('Modules.deny') }}
        </template>
      </el-table-column>
      <el-table-column prop="oper" width="120px">
        <template slot-scope="{ row }">
          <el-button type="dashed danger" size="mini" :disabled="notAbleChange" @click="handleDelete(row)">
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
        :page-size.sync="aclParams._limit"
        :current-page.sync="aclParams._page"
        :total="count"
        @size-change="initPageNLoad"
        @current-change="loadData"
      >
      </el-pagination>
    </div>
    <AddACLDialog v-model="showAddDialog" :type="type" @added="loadData" />
  </div>
</template>

<script>
import { loadAcl, deleteAcl, delete$allAcl } from '@/api/modules'
import AddACLDialog from './AddACLDialog.vue'
import { checkNOmitFromObj } from '@/common/utils.js'

export default {
  name: 'AclTablePage',

  components: { AddACLDialog },

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
        topic: '',
      },
      tableData: [],
      listLoading: false,
      aclParams: {
        _limit: 10,
        _page: 1,
      },
      count: 0,
      showAddDialog: false,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    initPageNLoad() {
      this.aclParams._page = 1
      this.loadData()
    },
    async loadData() {
      this.listLoading = true
      const searchParams = checkNOmitFromObj({
        topic: this.searchOpt.topic,
        [`_like_${this.type}`]: this.searchOpt[this.type],
      })
      const data = await loadAcl(this.type, { ...this.aclParams, ...searchParams })
      const {
        items = [],
        meta: { count = 0 },
      } = data
      this.tableData = items
      this.count = count
      this.listLoading = false
    },
    addACL() {
      this.showAddDialog = true
    },
    async handleDelete(row) {
      this.$confirm(this.$t('Modules.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          let res
          if (this.type !== '$all') {
            res = await deleteAcl(this.type, row[this.type], row.topic)
          } else {
            res = await delete$allAcl(row.topic)
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
