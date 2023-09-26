<template>
  <div class="audit-log" :loading="isTableLoading">
    <el-row :gutter="30">
      <el-col>
        <div class="audit-log-header">
          <div>
            <emq-select
              v-model="selectedNode"
              class="node-select"
              size="small"
              :field="{ options: nodes }"
              :field-name="{ label: 'name', value: 'node' }"
              clearable
              @change="search"
            />
          </div>
        </div>
        <el-table :data="tableData">
          <el-table-column prop="source_type" label="Source Type" />
          <el-table-column prop="source_ip" label="Source IP" />
          <el-table-column prop="operation_type" label="Module" />
          <el-table-column label="Operation">
            <template slot-scope="{ row }">
              {{ row.http_request.method }}
              <code>{{ row.http_request.path }}</code>
            </template>
          </el-table-column>
          <el-table-column label="Created At">
            <template slot-scope="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
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
            @current-change="getData"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import { queryAuditLogs, queryNodeAuditLogs } from '@/api/modules'
import { loadNodes } from '@/api/common'

export default {
  name: 'SlowQuery',
  data() {
    return {
      selectedNode: '',
      nodes: [],
      tableData: [],
      params: {
        _page: 1,
        _limit: 20,
      },
      count: 0,
      isTableLoading: false,
      typeFilters: [
        { text: this.$t('Modules.highAverageTime'), value: 'average' },
        { text: this.$t('Modules.messageBacklog'), value: 'expire' },
      ],
    }
  },

  created() {
    this.loadNodes()
    this.getData()
  },

  methods: {
    async loadNodes() {
      try {
        this.nodes = await loadNodes()
      } catch (error) {
        //
      }
    },
    async getData() {
      try {
        const {
          items,
          meta: { count = 0 },
        } = this.selectedNode
          ? await queryNodeAuditLogs(this.selectedNode, this.params)
          : await queryAuditLogs(this.params)
        this.tableData = items
        this.count = count
      } catch (error) {
        //
      }
    },
    search() {
      this.params.count = 0
      this.params.page = 1
      this.getData()
    },
    formatTime(time) {
      if (time < 1000) {
        return `${time}ms`
      }
      return `${time / 1000}s`
    },
    filterType(value, row) {
      return row.type === value
    },
    formatDate(ipt) {
      return moment(ipt).format('YYYY-MM-DD HH:mm:ss')
    },
  },
}
</script>

<style lang="scss">
.audit-log {
  padding: 10px;
  .audit-log-header {
    margin-bottom: 30px;
  }
  code {
    padding: 2px 4px;
    border-radius: 2px;
    background-color: #f2f1f1;
  }
}
</style>
