<template>
  <div class="audit-log">
    <div v-if="!isModuleEnabled" class="no-log-tip">
      <img src="../../assets/img/not_settings.png" alt="" width="375" />
      <p>{{ $t('Modules.auditLogDesc') }}</p>
      <el-button size="small" class="confirm-btn" type="primary" :loading="isStarting" @click="enableModule">
        {{ $t('Analysis.enable') }}
      </el-button>
    </div>
    <template v-else>
      <page-header>
        <div class="page-header-content-view">
          <div class="content">
            {{ $t('Modules.auditLogDesc') }}
          </div>
        </div>
      </page-header>
      <div class="app-wrapper" :loading="isTableLoading">
        <a-card class="emq-list-card">
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
                  <el-select
                    v-model="filterParams.source_type"
                    size="small"
                    :placeholder="$t('Modules.opSource')"
                    clearable
                  >
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
                      clearable
                    >
                      <el-option
                        v-for="{ value, label } in requestResultOpt"
                        :key="value"
                        :label="label"
                        :value="value"
                      />
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
                <template v-if="row.source_type !== SourceType.CLI">
                  {{ getLabelFromOpts(row.operation_type, opTypeList) }}:
                  {{ getLabelFromOpts(row.operation_name, opNameList) }}
                </template>
                <template v-else>
                  {{ Array.isArray(row.cli_args) ? row.cli_args.join(' ') : row.cli_args }}
                </template>
                <template v-if="row.http_request.bindings && Object.keys(row.http_request.bindings).length > 0">
                  <el-popover
                    placement="top"
                    trigger="hover"
                    width="400"
                    :open-delay="200"
                    popper-class="detail-popover"
                  >
                    <pre>{{ row.http_request.bindings }}</pre>
                    <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
                    <span slot="reference" class="details">
                      <i class="iconfont icon-bangzhu"></i>
                    </span>
                  </el-popover>
                </template>
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
        </a-card>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { pickBy, cloneDeep } from 'lodash'
import CustomPagination from '@/components/CustomPagination.vue'
import resourceDict from './resource_dict.json'
import { loadCreatedModules, queryAuditLogs, updateModule, loadAllModules } from '@/api/modules'
import { fillI18n } from '@/common/utils'

const SourceType = {
  Dashboard: 'dashboard',
  RestAPI: 'rest_api',
  CLI: 'cli',
}

const RequestResult = {
  Success: 'success',
  Failed: 'failure',
}

const LOG_MODULE_NAME = 'audit'
const LOG_MODULE_ID = 'module:audit'

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
      SourceType,
      isModuleAdded: false,
      isModuleEnabled: false,
      isLoading: true,
      isStarting: false,
      sourceTypeOpt: [
        { value: SourceType.Dashboard, label: 'Dashboard' },
        { value: SourceType.RestAPI, label: 'REST API' },
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

  async created() {
    this.init()
  },

  methods: {
    getLabelFromOpts,
    async confirmAuditLogEnabled() {
      try {
        const data = await loadCreatedModules()
        const moduleItem = data.find(({ id }) => id === LOG_MODULE_ID)
        this.isModuleAdded = !!moduleItem
        this.isModuleEnabled = moduleItem ? moduleItem.enabled : false
      } catch (error) {
        //
      }
    },
    async init() {
      try {
        this.isLoading = true
        await this.confirmAuditLogEnabled()
        if (this.isModuleEnabled) {
          this.getData()
        }
      } catch (error) {
        //
      } finally {
        this.isLoading = false
      }
    },
    parseI18n(val) {
      const data = fillI18n(val, ['title', 'description']).map((item) => {
        item.params = fillI18n(item.params, true)
        return item
      })
      return data
    },
    findModuleByName(moduleListMap, name) {
      let moduleItem
      Object.entries(moduleListMap).forEach(([, value]) => {
        value.forEach((item) => {
          if (item.name === name) {
            moduleItem = item
          }
        })
      })
      return moduleItem
    },
    async toModuleDetail() {
      const moduleListMap = await loadAllModules()
      const moduleItem = this.findModuleByName(moduleListMap, LOG_MODULE_NAME)
      if (!moduleItem) {
        return
      }
      const data = cloneDeep(moduleItem)
      this.parseI18n([data])
      const { params } = data
      const selectedModule = {
        paramsData: params,
        type: moduleItem.name,
        oper: 'add',
        title: moduleItem.title,
        description: moduleItem.description,
      }
      this.$store.dispatch('UPDATE_MODULE', selectedModule)

      this.$router.push({ name: 'module-detail', query: { backTo: 'log' } })
    },
    async enableModule() {
      try {
        this.isStarting = true
        if (!this.isModuleAdded) {
          await this.toModuleDetail()
        } else {
          await updateModule(LOG_MODULE_ID, { enabled: true })
          this.init()
        }
      } catch (error) {
        //
      } finally {
        this.isStarting = false
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
      const label = source_type === SourceType.RestAPI ? 'AppID' : this.$t('Modules.user')
      return `${label}: ${source}`
    },
  },
}
</script>

<style lang="scss">
.audit-log {
  padding: 10px;
  .no-log-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding-top: 160px;
    img {
      margin-bottom: 20px;
    }
    p {
      width: 360px;
      margin-bottom: 20px;
    }
    .confirm-btn {
      width: 100px;
    }
  }
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
