<template>
  <div class="rules">
    <div class="rules-page">
      <page-header>
        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              {{ $t('RuleEngine.definingRuleConditionsAndDataProcessing') }}
            </p>
            <div class="page-header-top-start">
              <a rel="noopener" :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-position"></i>
                {{ $t('RuleEngine.quickStart') }}
              </a>
            </div>
          </div>
        </div>
      </page-header>

      <div class="app-wrapper">
        <a-card class="card-filter">
          <el-form
            ref="filterParams"
            :model="filterParams"
            label-position="left"
            label-width="0px"
            class="form-filter"
            @keyup.enter.native="searchData"
          >
            <el-row :gutter="32" :class="{ 'multiple-rows': showMoreQuery }">
              <el-col :span="6">
                <el-form-item>
                  <el-input type="text" size="small" v-model="filterParams._like_id" placeholder="ID" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input
                    type="text"
                    size="small"
                    v-model="filterParams[keyForSearchTopic]"
                    :placeholder="$t('RuleEngine.topic')"
                  >
                    <template slot="prepend">
                      <el-select class="select-topic-type" size="small" v-model="keyForSearchTopic">
                        <el-option
                          v-for="{ label, value } in KEYS_FOR_SEARCH_TOPIC"
                          :key="value"
                          :label="label"
                          :value="value"
                        />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    class="select-status"
                    v-model="filterParams.enabled"
                    size="small"
                    clearable
                    :placeholder="$t('RuleEngine.status')"
                  >
                    <el-option :label="$t('RuleEngine.ruleEnabled')" :value="true" />
                    <el-option :label="$t('RuleEngine.ruleDisabled')" :value="false" />
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="showMoreQuery">
                <el-col :span="6">
                  <el-form-item>
                    <el-input
                      type="text"
                      size="small"
                      v-model="filterParams._like_description"
                      :placeholder="$t('RuleEngine.resourceDes')"
                    />
                  </el-form-item>
                </el-col>
              </template>

              <div class="col-oper">
                <el-button size="small" type="primary" plain @click="searchData">
                  {{ $t('Base.search') }}
                </el-button>
                <el-button
                  size="small"
                  plain
                  @click="
                    resetFilterParams()
                    loadData()
                  "
                >
                  {{ $t('Clients.reset') }}
                </el-button>
                <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
                  {{ showMoreQuery ? $t('Clients.collapse') : $t('Clients.expand') }}
                  <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </a>
              </div>
            </el-row>
          </el-form>
        </a-card>
        <a-card class="emq-list-card" :loading="listLoading">
          <div class="emq-table-header">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push('/rules/create')">
              {{ $t('Base.create') }}
            </el-button>
          </div>

          <el-table v-bind="rulesTable" :data="tableData" class="data-list">
            <el-table-column type="index" width="50" label=" "> </el-table-column>
            <el-table-column prop="id" label="ID">
              <template slot-scope="{ row }">
                <router-link
                  :to="{
                    name: 'rules-view',
                    params: { id: row.id },
                    query: { oper: 'view' },
                  }"
                >
                  {{ row.id }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="for" min-width="120" :label="$t('RuleEngine.topic')">
              <template slot-scope="{ row }">
                <div v-for="(item, index) in row.for" :key="index">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="metrics" :label="$t('RuleEngine.monitor')">
              <template slot-scope="{ row }">
                <i class="iconfont icon-tubiao-zhuzhuangtu btn btn-default" @click="showMetrics(row)"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              show-overflow-tooltip
              :label="$t('RuleEngine.describe')"
            ></el-table-column>
            <el-table-column prop="status" :label="$t('RuleEngine.status')">
              <template slot-scope="{ row }">
                <el-tooltip
                  :content="row.enabled ? $t('RuleEngine.ruleEnabled') : $t('RuleEngine.ruleDisabled')"
                  placement="left"
                >
                  <el-switch
                    v-model="row.enabled"
                    active-text=""
                    inactive-text=""
                    active-color="#13ce66"
                    inactive-color="#d0d3e0"
                    @change="updateRule(row)"
                  >
                  </el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="actions"
              :filters="filterOptions.actions"
              :filter-method="actionsColumnFilter"
              filter-placement="bottom"
              :formatter="actionsFormatter"
              :label="$t('RuleEngine.responseAction')"
            >
            </el-table-column>
            <el-table-column width="200px" prop="id">
              <template slot-scope="{ row }">
                <el-button type="dashed" size="mini" @click="editRule(row)">
                  {{ $t('Base.edit') }}
                </el-button>
                <el-button type="dashed" size="mini" @click="copyRule(row)">
                  {{ $t('RuleEngine.duplicate') }}
                </el-button>
                <el-button type="dashed danger" size="mini" @click="deleteRule(row)">
                  {{ $t('Base.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="emq-table-footer">
            <el-pagination
              hide-on-single-page
              background
              layout="total, sizes, prev, pager, next"
              :page-sizes="[10, 50, 100, 300, 500]"
              :current-page.sync="pageParams._page"
              :page-size="pageParams._limit"
              :total="rulesCount"
              @size-change="handlePageSizeChanged"
              @current-change="loadData"
            />
          </div>
        </a-card>
      </div>
    </div>

    <a-drawer v-bind="rulesDrawer" placement="right" closable :visible="metricsDrawerVisible" @close="onMetricsClose">
      <el-button class="btn-reset" type="primary" plain size="small" @click="resetStatistics">
        {{ $t('RuleEngine.resetRuleStatistics') }}
      </el-button>
      <div class="rule-metrics">
        <div class="metrics-item">
          <div class="metrics-item-title">
            {{ $t('RuleEngine.ruleMetrics') }}
          </div>
          <ul class="metrics-item-body field-info rule-metrics">
            <li class="field-info-item">
              <div class="field-title">{{ $t('RuleEngine.matched') }}:</div>
              <span class="field-value">
                {{ currentRules.metricsData.matched }}
                <span class="unit">{{ $t('RuleEngine.times') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.sqlPassed') }}
                <el-popover width="220" placement="right" trigger="hover">
                  {{ $t('RuleEngine.sqlPassedDesc') }}
                  <i slot="reference" class="icon el-icon-question"></i>
                </el-popover>
                :
              </div>
              <span class="field-value">
                {{ currentRules.metricsData.passed }}
                <span class="unit">{{ $t('RuleEngine.times') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.sqlFailed') }}
                <el-popover width="220" placement="right" trigger="hover">
                  {{ $t('RuleEngine.sqlFailedDesc') }}
                  <i slot="reference" class="icon el-icon-question"></i> </el-popover
                >:
              </div>
              <span class="field-value">
                {{ currentRules.metricsData.exception }}
                <span class="unit">{{ $t('RuleEngine.times') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.sqlNoResult') }}
                <el-popover width="220" placement="right" trigger="hover">
                  {{ $t('RuleEngine.sqlNoResultDesc') }}
                  <i slot="reference" class="icon el-icon-question"></i> </el-popover
                >:
              </div>
              <span class="field-value">
                {{ currentRules.metricsData.no_result }}
                <span class="unit">{{ $t('RuleEngine.times') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">{{ $t('RuleEngine.currentSpeed') }}:</div>

              <span class="field-value">
                {{ currentRules.metricsData.speed }}
                <span class="unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">{{ $t('RuleEngine.maximumSpeed') }}:</div>
              <span class="field-value">
                {{ currentRules.metricsData.speed_max }}
                <span class="unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">{{ $t('RuleEngine.last5MinutesSpeed') }}:</div>
              <span class="field-value">
                {{ currentRules.metricsData.speed_last5m }}
                <span class="unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>
          </ul>
        </div>

        <div class="metrics-item">
          <div class="metrics-item-title">{{ $t('RuleEngine.actionMetrics') }}</div>

          <template v-if="currentRules.actions.length === 0"> </template>

          <div v-for="(item, i) in currentRules.actions" :key="i" class="metrics-item-body">
            <ul class="field-info metrics-item-body action-metrics">
              <div class="item-title">
                {{ item.name }}
              </div>

              <li class="field-info-item">
                <div class="field-title">{{ $t('RuleEngine.success') }}:</div>
                <span class="field-value">
                  {{ item.success }}
                </span>
              </li>
              <li class="field-info-item">
                <div class="field-title">{{ $t('RuleEngine.fail') }}:</div>
                <span class="field-value">
                  {{ item.failed }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import {
  loadRules,
  loadRuleDetails,
  loadActions,
  destroyRule,
  loadRuleEvents,
  updateRule,
  resetRuleStatistics,
} from '@/api/rules'
import { getLink } from '@/common/utils'

const createRawFilterParams = () => ({
  _like_id: undefined,

  _like_for: undefined,
  _match_for: undefined,

  enabled: undefined,
  _like_description: undefined,
})

const KEYS_FOR_SEARCH_TOPIC = [
  { value: '_like_for', label: 'Topic' },
  { value: '_match_for', label: 'Wildcard' },
]

export default {
  name: 'Rules',

  data() {
    return {
      KEYS_FOR_SEARCH_TOPIC,
      docs: {
        tutorial: getLink('ruleEngineTutorial'),
        docs: '',
      },
      listLoading: false,
      metricsDrawerVisible: false,
      currentRules: {
        actions: [
          {
            id: 'do_nothing_1562653876521962460',
            metrics: [{ failed: 0, node: 'emqx@127.0.0.1', success: 3 }],
            name: 'do_nothing',
            params: {},
          },
        ],
        description: '',
        enabled: true,
        for: ['client.connected'],
        id: 'rule:33570eea',
        metrics: [
          {
            matched: 3,
            node: 'emqx@127.0.0.1',
            speed: 0,
            speed_last5m: 0,
            speed_max: 0.1,
          },
        ],
        rawsql: 'SELECT * FROM "client.connected"',
        event: {
          columns: [
            'clientid',
            'username',
            'event',
            'auth_result',
            'clean_start',
            'connack',
            'connected_at',
            'is_bridge',
            'keepalive',
            'mountpoint',
            'peername',
            'proto_ver',
            'timestamp',
            'node',
          ],
          description: '连接建立',
          event: 'client.connected',
          sql_example: 'SELECT * FROM "client.connected"',
          test_columns: {
            clientid: 'c_emqx',
            username: 'u_emqx',
            auth_result: 'success',
            peername: '127.0.0.1:63412',
          },
          title: '连接建立',
        },
        metricsData: {
          matched: 3,
          speed: 0,
          speed_last5m: 0,
          speed_max: 0.1,
        },
      },
      filterOptions: {
        for: [],
        actions: [],
      },
      rulesDrawer: {
        title: '',
        width: '400px',
      },
      rulesTable: {
        'row-key': 'id',
      },
      tableData: [],
      actionsMap: {},
      actionsFormatter(row, column, cellValue) {
        return cellValue.map(($) => $._name).join(',')
      },
      pageParams: {
        _limit: 10,
        _page: 1,
      },
      rulesCount: 0,
      showMoreQuery: false,
      filterParams: createRawFilterParams(),
      keyForSearchTopic: KEYS_FOR_SEARCH_TOPIC[0].value,
    }
  },

  async created() {
    const events = await loadRuleEvents()
    this.filterOptions.for = events.map(($) => ({ text: $.event, value: $.event }))
    this.loadActionsFilter().then(this.loadData)
  },

  methods: {
    deleteRule(row) {
      this.$msgbox
        .confirm(this.$t('RuleEngine.deleteRuleConfirm'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyRule(row.id)
          this.loadData()
          this.$message.success(this.$t('Base.deleteSuccess'))
        })
        .catch(() => {})
    },

    forColumnFilter(value, row) {
      return (row.for || []).includes(value)
    },

    actionsColumnFilter(value, row) {
      return (row.actions || []).find(($) => $.name === value)
    },

    getFilterParams() {
      const { _like_for, _match_for, ...filterParams } = this.filterParams
      const ret = Object.keys(filterParams).reduce((obj, currentKey) => {
        const currentVal = this.filterParams[currentKey]
        if (currentVal !== undefined && currentVal !== '') {
          return { ...obj, [currentKey]: currentVal }
        }
        return obj
      }, {})
      if (this.filterParams[this.keyForSearchTopic]) {
        ret[this.keyForSearchTopic] = this.filterParams[this.keyForSearchTopic]
      }
      return ret
    },

    async loadData() {
      try {
        const params = { ...this.pageParams, ...this.getFilterParams() }
        const { items, meta } = await loadRules(params)
        items.forEach((rule) => {
          rule.actions.forEach((action) => {
            action._name = this.actionsMap[action.name]
          })
        })
        this.tableData = items
        this.rulesCount = meta.count
      } catch (error) {
        //
      }
    },

    resetPageNo() {
      this.pageParams._page = 1
    },

    searchData() {
      this.resetPageNo()
      this.loadData()
    },

    resetFilterParams() {
      this.filterParams = createRawFilterParams()
      this.resetPageNo()
    },

    handlePageSizeChanged(size) {
      this.pageParams._limit = size
      this.resetPageNo()
      this.loadData()
    },

    async loadActionsFilter() {
      const actions = await loadActions({
        fillI18n: true,
      })
      this.filterOptions.actions = actions.map(($) => ({ text: $.title, value: $.name }))

      this.actionsMap = {}
      this.filterOptions.actions.forEach((action) => {
        const { text, value } = action
        this.actionsMap[value] = text
      })
    },

    async showMetrics(row) {
      this.currentRules = await loadRuleDetails(row.id)
      this.rulesDrawer.title = row.id
      this.metricsDrawerVisible = true
    },

    async refreshMetrics() {
      this.currentRules = await loadRuleDetails(this.currentRules.id)
    },

    async resetStatistics() {
      await this.$msgbox.confirm(this.$t('RuleEngine.resetRuleStatisticsConfirm'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
      await resetRuleStatistics(this.currentRules.id)
      this.$message.success(this.$t('RuleEngine.resetSuccessfully'))
      this.refreshMetrics()
    },

    onMetricsClose() {
      this.metricsDrawerVisible = false
    },

    async updateRule(row) {
      const { id, enabled } = row
      updateRule(id, { enabled })
        .then((res) => {
          if (res) {
            const msg = enabled ? this.$t('RuleEngine.ruleEnabled') : this.$t('RuleEngine.ruleDisabled')
            this.$message.success(msg)
          }
        })
        .catch(() => {
          row.enabled = row.enabled !== true
        })
    },
    editRule(row) {
      this.$router.push({
        name: 'rules-create',
        query: { rule: row.id },
      })
    },
    copyRule({ id }) {
      this.$router.push({ name: 'rules-create', query: { command: 'copy', rule: id } })
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-reset {
  position: absolute;
  top: 14px;
  right: 48px;
}
.rule-metrics {
  .metrics-item {
    margin-bottom: 50px;

    .metrics-item-title {
      font-size: 14px;
      font-weight: bold;
      color: #101010;
    }

    .oper-wrapper {
      margin: 20px auto;
      text-align: center;
    }
  }

  .field-info {
    margin-top: 12px;

    &.rule-metrics {
      .field-title {
        min-width: 130px;
      }
    }

    &.action-metrics {
      .field-info-item {
        padding-left: 12px;
      }
      .field-title {
        min-width: 40px;
      }
    }
  }

  .metrics-item-body {
    .item-title {
      color: #101010;
    }
  }
}
.emq-list-card {
  margin-top: 20px;
}
</style>

<style lang="scss">
.rules-page {
  .page-title {
    margin-bottom: 24px;
  }

  .form-filter {
    .select-status {
      width: 100%;
    }
    .el-row.multiple-rows {
      .el-col {
        margin-bottom: 12px;
      }
    }
    .el-col {
      line-height: 1;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .el-form-item__content {
      line-height: 1;
    }
  }

  .col-oper {
    float: right;
    position: relative;
    top: 1px;
    .show-more {
      margin: 0px 10px;
      font-size: 12px;
    }
    margin-bottom: 10px;
  }

  .select-topic-type {
    .el-input {
      width: 100px;
    }
  }
}
</style>
