<template>
  <div class="audit-log" :loading="isTableLoading">
    <div class="audit-log-header">
      <el-form class="search-wrapper" @keyup.enter.native="search">
        <el-row :gutter="20">
          <!-- Time Range -->
          <el-col :span="8">
            <div class="time-range">
              <el-date-picker
                v-model="filterParams._gte_created_at"
                type="datetime"
                size="small"
                value-format="timestamp"
                :placeholder="$t('Modules.startTime')"
              />
              <span class="separator">-</span>
              <el-date-picker
                v-model="filterParams._lte_created_at"
                type="datetime"
                size="small"
                value-format="timestamp"
                :placeholder="$t('Modules.endTime')"
              />
            </div>
          </el-col>
          <!-- Source Type -->
          <el-col :span="8">
            <el-select v-model="filterParams.source_type" size="small" :placeholder="$t('Modules.opSource')">
              <el-option v-for="{ value, label } in sourceTypeOpt" :key="value" :label="label" :value="value" />
            </el-select>
          </el-col>
          <!-- Source -->
          <el-col :span="8">
            <el-input v-model="filterParams.source" size="small" :placeholder="$t('Modules.source')" />
          </el-col>
          <!-- Source IP -->
          <el-col :span="8">
            <el-input v-model="filterParams.source_ip" size="small" placeholder="IP" />
          </el-col>
          <!-- Operation Name -->
          <el-col :span="8">
            <el-select
              v-model="filterParams.operation_name"
              size="small"
              filterable
              clearable
              allow-create
              :placeholder="$t('Modules.opName')"
            >
              <el-option v-for="{ value, label } in opNameList" :key="value" :label="label" :value="value" />
            </el-select>
          </el-col>

          <template v-if="showMoreQuery">
            <!-- Operation Result -->
            <el-col :span="8">
              <el-select
                v-model="filterParams.operation_result"
                class="comparator"
                size="small"
                :placeholder="$t('Modules.operationResult')"
              >
                <el-option v-for="{ value, label } in requestResultOpt" :key="value" :label="label" :value="value" />
              </el-select>
            </el-col>
          </template>
          <el-col :span="showMoreQuery ? 24 : 8">
            <div class="col-oper">
              <el-button type="primary" icon="el-icon-search" size="small" @click="search">
                {{ $t('Clients.search') }}
              </el-button>
              <el-button plain size="small" icon="el-icon-refresh" @click="resetSearch">
                {{ $t('Clients.reset') }}
              </el-button>
              <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
                {{ showMoreQuery ? $t('Clients.collapse') : $t('Clients.expand') }}
                <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </a>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData">
      <el-table-column :label="$t('Modules.time')">
        <template slot-scope="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="operation_type" :label="$t('Modules.info')">
        <template slot-scope="{ row }">
          <template v-if="row.http_request.bindings && Object.keys(row.http_request.bindings).length > 0">
            <el-popover placement="top" trigger="hover" width="400" :open-delay="500" popper-class="detail-popover">
              <pre>{{ row.http_request.bindings }}</pre>
              <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
              <span slot="reference" class="details">
                <i class="iconfont icon-bangzhu"></i>
              </span>
            </el-popover>
          </template>
          {{ getLabelFromOpts(row.operation_type, opTypeList) }}:
          {{ getLabelFromOpts(row.operation_name, opNameList) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Modules.opSource')">
        <template slot-scope="{ row }">
          {{ getLabelFromOpts(row.source_type, sourceTypeOpt) }}
          <br />
          {{ getSourceData(row) }}
        </template>
      </el-table-column>
      <el-table-column prop="source_ip" label="IP" />
      <el-table-column :label="$t('Modules.operationResult')">
        <template slot-scope="{ row }">
          {{ getLabelFromOpts(row.operation_result, requestResultOpt) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <el-pagination
        v-if="count > 10"
        hide-on-single-page
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="params._limit"
        :current-page.sync="params._page"
        :total="count"
        @size-change="search"
        @current-change="getData"
      />
      <custom-pagination
        v-if="count === -1 && tableData.length"
        :hasnext="hasnext"
        :page="params._page"
        @prevClick="handlePrevClick"
        @nextClick="handleNextClick"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { pickBy } from 'lodash'
import { queryAuditLogs } from '@/api/modules'
import CustomPagination from '@/components/CustomPagination.vue'
import resourceDict from './resource_dict.json'

const SourceType = {
  Dashboard: 'dashboard',
  Management: 'management',
  CLI: 'cli',
}

const RequestResult = {
  Success: 'success',
  Failed: 'failure',
}

const handleTimeStr = (timestamp) => Math.floor(timestamp)

const getLabelFromOpts = (value, opts) => {
  const opt = opts.find((item) => item.value === value)
  return opt ? opt.label : value || ''
}

export default {
  name: 'AuditLog',
  components: {
    CustomPagination,
  },
  data() {
    const { types, names } = resourceDict
    const { lang } = this.$store.state
    const langKey = lang === 'zh' ? 'zh' : 'en'
    const opTypeList = Object.entries(types).map(([key, value]) => ({
      value: key,
      label: value[langKey],
    }))
    const opNameList = Object.entries(names).map(([key, value]) => ({
      value: key,
      label: value[langKey],
    }))
    return {
      isLoading: true,
      sourceTypeOpt: [
        { value: SourceType.Dashboard, label: 'Dashboard' },
        { value: SourceType.Management, label: 'Management' },
        { value: SourceType.CLI, label: 'CLI' },
      ],
      requestResultOpt: [
        { value: RequestResult.Success, label: this.$t('Modules.success') },
        { value: RequestResult.Failed, label: this.$t('Modules.failure') },
      ],
      opTypeList,
      opNameList,

      showMoreQuery: false,

      filterParams: {
        _gte_created_at: '',
        _lte_created_at: '',
        source_type: '',
        source: '',
        source_ip: '',
        operation_name: '',

        operation_type: '',
        operation_result: '',
      },

      tableData: [],
      hasnext: false,
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
    this.getData()
  },

  methods: {
    getLabelFromOpts,
    handleParams(params) {
      if (params._gte_created_at) {
        params._gte_created_at = handleTimeStr(params._gte_created_at)
      }
      if (params._lte_created_at) {
        params._lte_created_at = handleTimeStr(params._lte_created_at)
      }
      return params
    },
    async getData() {
      const filterParams = pickBy(this.filterParams, Boolean)
      const params = this.handleParams({ ...this.params, ...filterParams })
      try {
        this.isLoading = true
        const {
          items,
          meta: { count = 0, hasnext = false },
        } = await queryAuditLogs(params)
        this.tableData = items
        this.count = count
        this.hasnext = hasnext
      } catch (error) {
        //
      } finally {
        this.isLoading = false
      }
    },
    handlePrevClick() {
      if (this.params._page === 1) {
        return
      }
      this.params._page -= 1
      this.getData()
    },
    handleNextClick() {
      if (!this.hasnext) {
        return
      }
      this.params._page += 1
      this.getData()
    },
    search() {
      this.count = 0
      this.params._page = 1
      this.getData()
    },
    resetSearch() {
      Object.keys(this.filterParams).forEach((key) => {
        this.filterParams[key] = ''
      })
      this.search()
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
    getSourceData(row) {
      const { source_type, node, source } = row
      if (source_type === SourceType.CLI) {
        return `${this.$t('Clients.node')}: ${node || ''}`
      }
      const label = source_type === SourceType.Management ? 'AppID' : this.$t('Modules.user')
      return `${label}: ${source}`
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
  .search-wrapper {
    display: block;
    width: 100%;
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner,
    .el-select {
      width: 100%;
    }
    .col-oper {
      float: right;
    }
    .show-more {
      margin-left: 12px;
      text-decoration: none;
    }
    .el-col-8 {
      margin-bottom: 20px;
      .el-col-8 {
        margin-bottom: 0;
      }
    }
    .time-range {
      display: flex;
      align-items: center;
      .separator {
        flex-grow: 0;
        padding: 0 4px;
      }
    }
  }
}
</style>
