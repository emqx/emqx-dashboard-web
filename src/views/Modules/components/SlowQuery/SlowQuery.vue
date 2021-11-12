<template>
  <div class="slow-query">
    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="isTableLoading">
        <div class="emq-table-header">
          <el-button class="confirm-btn" type="primary" size="small" @click="clearData">
            {{ $t('Modules.clearData') }}
          </el-button>
        </div>
        <el-table :data="tableData">
          <el-table-column prop="topic" label="Topic"></el-table-column>
          <el-table-column prop="count" :label="$t('Modules.timeoutTimes')"></el-table-column>
          <el-table-column :label="$t('Modules.averageTime')">
            <template slot-scope="{ row }"> {{ row.elapsed / 1000 }} s </template>
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
            :total="count"
            @size-change="handleSizeChange"
            @current-change="getTopicRecordData"
          >
          </el-pagination>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
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
          data = [],
          meta: { count = 0 },
        } = await querySlowQueryTopicData(this.params)
        this.tableData = data
        this.count = count
      } catch (error) {
        //
      } finally {
        this.isTableLoading = false
      }
    },
    handleSizeChange() {
      this.params.page = 1
      this.getTopicRecordData()
    },
    async clearData() {
      try {
        await this.$msgbox.confirm(this.$t('Modules.clearSlowQueryConfirm'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        await clearSlowQueryData()
        this.$message.success(this.$t('Modules.successfulCleanSlowQuey'))
      } catch (error) {
        //
      }
    },
  },
}
</script>

<style lang="scss">
.slow-query {
  .emq-table-header {
    justify-content: flex-end;
  }
}
</style>
