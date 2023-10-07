<template>
  <div class="audit-log" :loading="isTableLoading">
    <div class="audit-log-header">
      <el-form class="search-wrapper" @keyup.enter.native="search">
        <el-row :gutter="20">
          <el-col :span="8">
            <emq-select
              v-model="filterParams.node"
              class="node-select"
              size="small"
              :field="{ options: nodes }"
              :field-name="{ label: 'name', value: 'node' }"
              :placeholder="$t('Clients.node')"
              clearable
              @change="search"
            />
          </el-col>
          <el-col :span="8">
            <el-select v-model="filterParams.source_type" size="small" :placeholder="$t('Modules.source')">
              <el-option v-for="{ value, label } in sourceTypeOpt" :key="value" :label="label" :value="value" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="filterParams.source" size="small" :placeholder="$t('Base.userName')" />
          </el-col>
          <el-col :span="8">
            <el-input v-model="filterParams.source_ip" size="small" :placeholder="$t('Modules.sourceIp')" />
          </el-col>
          <el-col :span="8">
            <el-select v-model="filterParams.http_method" size="small" :placeholder="$t('Modules.httpMethod')">
              <el-option v-for="{ value, label } in httpMethodOpt" :key="value" :label="label" :value="value" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="filterParams.operation_type"
              size="small"
              filterable
              clearable
              :placeholder="$t('Modules.resourceType')"
            >
              <el-option v-for="item in resourceTypeList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-col>
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
          <template v-if="showMoreQuery">
            <el-col :span="8">
              <el-input v-model="filterParams.operation_name" size="small" :placeholder="$t('Modules.resourceName')" />
            </el-col>
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
            <el-col :span="8">
              <el-input
                v-model.number="filterParams.http_status_code"
                size="small"
                :placeholder="$t('Modules.HTTPStatusCode')"
              />
            </el-col>
          </template>
          <el-col :span="16">
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
      <el-table-column prop="source_type" :label="$t('Modules.source')" />
      <el-table-column prop="source" :label="$t('Base.userName')" />
      <el-table-column prop="source_ip" :label="$t('Modules.sourceIp')" />
      <el-table-column prop="operation_type" :label="$t('Modules.resource')">
        <template slot-scope="{ row }">
          {{ row.operation_type }} >
          {{ row.operation_name }}
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="{ row }">
          {{ row.http_request.method }}
          <code>{{ row.http_request.path }}</code>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Modules.time')">
        <template slot-scope="{ row }">
          {{ formatDate(row.created_at) }}
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
import { queryAuditLogs, queryNodeAuditLogs } from '@/api/modules'
import { loadNodes } from '@/api/common'
import CustomPagination from '@/components/CustomPagination.vue'

const SourceType = {
  Dashboard: 'dashboard',
  Management: 'management',
  CLI: 'cli',
}

const HTTPMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

const RequestResult = {
  Success: 'success',
  Failed: 'failure',
}

const resourceTypeList = [
  'topic',
  'maybe_start_modules',
  'data',
  'clients',
  'mqtt',
  'nodes',
  'cluster',
  'auth',
  'brokers',
  'alarms',
  'apps',
  'users',
  'banned',
  'trace',
  'module_types',
  'modules',
  'sasl',
  'slow_subscriptions',
  'gcp_devices',
  'stats',
  'monitor',
  'license_info',
  'metrics',
  'license',
  'auth_clientid',
  'auth_username',
  'auth_user',
  'emqx_acl',
  'rule_events',
  'rules',
  'actions',
  'resource_types',
  'resources',
  'schemas',
  'routes',
  'configs',
  'configs_spec',
  'subscriptions',
  'change_pwd',
  'auth_',
  'acl',
  'audits',
  'plugins',
]

const handleTimeStr = (timestamp) => Math.floor(timestamp)

export default {
  name: 'AuditLog',
  components: {
    CustomPagination,
  },
  data() {
    return {
      isLoading: true,
      nodes: [],
      sourceTypeOpt: [
        { value: SourceType.Dashboard, label: 'Dashboard' },
        { value: SourceType.Management, label: 'Management' },
        { value: SourceType.CLI, label: 'CLI' },
      ],
      httpMethodOpt: Object.entries(HTTPMethod).map(([label, value]) => ({ value, label })),
      requestResultOpt: [
        { value: RequestResult.Success, label: this.$t('Modules.success') },
        { value: RequestResult.Failed, label: this.$t('Modules.failure') },
      ],
      resourceTypeList,

      showMoreQuery: false,

      filterParams: {
        node: '',
        source_type: '',
        source: '',
        source_ip: '',
        http_method: '',
        operation_type: '',
        _gte_created_at: '',
        _lte_created_at: '',

        operation_name: '',
        operation_result: '',
        http_status_code: '',
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
      const { node, ...filterParams } = this.filterParams
      const params = this.handleParams({ ...this.params, ...pickBy(filterParams, Boolean) })
      try {
        this.isLoading = true
        const {
          items,
          meta: { count = 0, hasnext = false },
        } = node ? await queryNodeAuditLogs(node, params) : await queryAuditLogs(params)
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
