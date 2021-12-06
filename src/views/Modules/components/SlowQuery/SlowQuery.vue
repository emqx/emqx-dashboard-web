<template>
  <div class="slow-query" :loading="isTableLoading">
    <el-row :gutter="30">
      <el-col>
        <div class="slow-query-header">
          <el-button class="confirm-btn" type="primary" size="small" @click="clearData">
            {{ $t('Modules.clearData') }}
          </el-button>
        </div>
        <el-table :data="tableData">
          <el-table-column prop="clientid" label="Client ID">
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
          <el-table-column :filters="typeFilters" filter-placement="bottom-start" :filter-method="filterType">
            <template slot="header">
              <span>{{ $t('General.reason') }}</span>
              <el-popover placement="top-start" width="320" trigger="hover">
                <div>
                  <b>{{ $t('Modules.messageBacklog') }}</b> {{ ': ' + $t('Modules.messageBacklogDesc') }}
                  <br />
                  <b>{{ $t('Modules.highAverageTime') }}</b> {{ ': ' + $t('Modules.highAverageTimeDesc') }}
                </div>
                <i slot="reference" class="el-icon-question icon-column-desc"></i>
              </el-popover>
            </template>
            <template slot-scope="{ row }">
              {{ reasonText(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="latency" :label="$t('Modules.latencyTime')" sortable>
            <template slot-scope="{ row }"> {{ formatTime(row.latency) }} </template>
          </el-table-column>
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
            :page-size.sync="params._limit"
            :current-page.sync="params._page"
            :total="count"
            @size-change="handleSizeChange"
            @current-change="getTopicRecordData"
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

export default {
  name: 'SlowQuery',
  data() {
    return {
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
    this.getTopicRecordData()
  },

  methods: {
    async getTopicRecordData() {
      try {
        this.isTableLoading = true
        const {
          items = [],
          meta: { count = 0 },
        } = await querySlowQueryTopicData(this.params)
        this.tableData = items
        this.count = count
      } catch (error) {
        //
      } finally {
        this.isTableLoading = false
      }
    },
    handleSizeChange() {
      this.params._page = 1
      this.getTopicRecordData()
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
        this.handleSizeChange()
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
