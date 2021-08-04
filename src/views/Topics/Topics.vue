<template>
  <div class="app-wrapper topics">
    <el-row class="search-wrapper">
      <el-col :span="8">
        <el-input v-model="searchValue" size="small" :placeholder="$t('Topics.topic')"></el-input>
      </el-col>
      <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
        {{ $t('Clients.search') }}
      </el-button>

      <el-table :data="tableData" v-loading.lock="lockTable">
        <el-table-column prop="topic" :label="$t('Topics.topic')" sortable></el-table-column>
        <el-table-column prop="node" :label="$t('Clients.node')" sortable></el-table-column>
      </el-table>
    </el-row>

    <div class="emq-table-footer">
      <!-- <el-pagination
        v-if="count > 0"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="params.limit"
        :current-page.sync="params.page"
        :total="count"
        @size-change="
          () => {
            this.loadTopics(true)
          }
        "
        @current-change="loadTopics"
      >
      </el-pagination> -->
      <common-pagination :count="count" :reload-func="loadTopics"></common-pagination>
    </div>
  </div>
</template>

<script>
import { listTopics } from '@/api/common'
import CommonPagination from '../../components/commonPagination.vue'

export default {
  name: 'Topics',
  components: {
    CommonPagination,
  },
  data() {
    return {
      tableData: [],
      searchValue: '',
      lockTable: true,
      params: {
        // page: 1,
        // limit: 20,
      },
      count: 0,
    }
  },

  created() {
    // this.loadTopics()
  },

  methods: {
    async handleSearch() {
      const topic = this.searchValue.trim()
      if (!topic) {
        this.loadTopics()
        return
      }
      // this.params.page = 1
      await this.loadTopics({ topic, page: 1 })
    },

    async loadTopics(params = {}) {
      // if (reload) {
      //   this.params.page = 1
      // }
      this.lockTable = true

      const res = await listTopics({ ...this.params, ...params }).catch(() => {})
      if (res) {
        const { data = [], meta = {} } = res
        this.tableData = data
        this.count = meta.count || this.count
      }
      this.lockTable = false
    },
  },
}
</script>
<style lang="scss" scoped></style>
