<template>
  <div class="topics">
    <div class="app-wrapper">
      <el-card shadow="never" class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <div class="search-wrapper">
            <el-input v-model="searchValue" size="small" :placeholder="$t('Topics.topic')"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
              {{ $t('Clients.search') }}
            </el-button>
            <el-button plain size="small" :icon="resetIcon" @click="resetSearch">
              {{ searchValue ? $t('Clients.reset') : $t('Clients.refresh') }}
            </el-button>
          </div>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="topic" :label="$t('Topics.topic')"></el-table-column>
          <el-table-column prop="node" :label="$t('Clients.node')"></el-table-column>
        </el-table>

        <div class="emq-table-footer">
          <el-pagination
            hide-on-single-page
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
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { listTopics, searchTopics } from '@/api/topics'

export default {
  name: 'Topics',

  data() {
    return {
      listLoading: true,
      tableData: [],
      searchValue: '',
      params: {
        _page: 1,
        _limit: 20,
      },
      count: 0,
      resetIcon: 'el-icon-refresh',
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    resetSearch() {
      this.resetIcon = 'el-icon-loading'
      let reload = false
      if (this.searchValue) {
        reload = true
      }
      this.searchValue = ''
      this.loadTopics(reload)
    },
    async handleSearch() {
      const topic = this.searchValue.trim()
      if (!topic) {
        this.loadTopics()
        return
      }
      this.params._page = 1
      this.count = 0
      this.tableData = await searchTopics(topic)
    },
    handleSizeChange() {
      this.loadTopics(true)
    },
    handleCurrentPageChange() {
      this.loadTopics()
    },
    async loadData() {
      this.loadTopics()
    },
    async loadTopics(reload, params = {}) {
      if (reload) {
        this.params._page = 1
      }
      const data = await listTopics({ ...this.params, ...params })
      const {
        items = [],
        meta: { count = 0 },
      } = data
      this.listLoading = false
      this.tableData = items
      this.count = count
      this.resetIcon = 'el-icon-refresh'
    },
  },
}
</script>
