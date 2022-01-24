<template>
  <div class="slow-query" :loading="isTableLoading">
    <el-row :gutter="30">
      <el-col>
        <div class="slow-query-header">
          <el-button class="confirm-btn" type="primary" size="small" @click="clearData">
            {{ $t('Modules.clearData') }}
          </el-button>
        </div>
        <el-table :data="tableData" @sort-change="sortTable">
          <el-table-column prop="clientid" :label="$t('Clients.clientId')">
            <template slot-scope="{ row }">
              <router-link
                :to="{
                  path: '/clients/detail',
                  query: { clientid: row.clientid },
                }"
              >
                {{ row.clientid }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="topic" :label="$t('Topics.topic')" />
          <el-table-column prop="timespan" :label="$t('Modules.duration')" sortable="custom">
            <template slot-scope="{ row }"> {{ formatTime(row.timespan) }} </template>
          </el-table-column>
          <el-table-column prop="node" :label="$t('Clients.node')" />
          <el-table-column prop="last_update_time" :label="$t('Modules.updated')">
            <template slot-scope="{ row }">
              {{ formatDate(row.last_update_time) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="emq-table-footer">
          <el-pagination
            hide-on-single-page
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[20, 50, 100, 500]"
            :page-size.sync="params.limit"
            :current-page.sync="params.page"
            :total="params.count"
            @size-change="refreshLocalData"
            @current-change="getPageData"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import { querySlowQueryTopicData, clearSlowQueryData } from '@/api/modules'
import paging from '@/common/paging'

const { setTotalData, getAPageData } = paging()

export default {
  name: 'SlowQuery',
  data() {
    return {
      totalSlowSubData: [],
      tableData: [],
      params: {
        page: 1,
        limit: 20,
        count: 0,
      },
      isTableLoading: false,
      tableSorter: undefined,
      typeFilters: [
        { text: this.$t('Modules.highAverageTime'), value: 'average' },
        { text: this.$t('Modules.messageBacklog'), value: 'expire' },
      ],
    }
  },

  created() {
    this.getTopicRecordData()
  },

  methods: {
    async getTopicRecordData() {
      try {
        this.isTableLoading = true
        const {
          items = [],
          meta: { count = 0 },
        } = await querySlowQueryTopicData()
        this.totalSlowSubData = items
        setTotalData(items)
        this.getPageData()
        this.count = count
      } catch (error) {
        //
      } finally {
        this.isTableLoading = false
      }
    },
    getPageData() {
      const { limit, page } = this.params
      const { tableSorter } = this
      const { data, meta } = getAPageData({ limit, page }, [], tableSorter)
      this.params = meta
      this.tableData = data
    },
    refreshLocalData() {
      this.params.page = 1
      this.getPageData()
    },
    sortTable(orderMsg) {
      const { order } = orderMsg
      this.tableSorter = !order
        ? undefined
        : {
            key: 'timespan',
            type: order === 'descending' ? 'desc' : 'asc',
          }
      this.refreshLocalData()
    },
    async clearData() {
      try {
        await this.$msgbox.confirm(this.$t('Modules.clearSlowSubscriptionConfirm'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        await clearSlowQueryData()
        this.$message.success(this.$t('Modules.successfulCleanSlowSubscription'))
        this.getTopicRecordData()
      } catch (error) {
        //
      }
    },
    reasonText(reason) {
      return (
        {
          average: this.$t('Modules.highAverageTime'),
          expire: this.$t('Modules.messageBacklog'),
        }[reason] || ''
      )
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
.slow-query {
  padding: 10px;
  .slow-query-header {
    margin-bottom: 30px;
  }
  .icon-column-desc {
    margin-left: 6px;
    margin-right: 6px;
  }
}
</style>
