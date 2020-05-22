<template>
  <div class="rules">

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
      <a-card
        class="emq-list-card"
        :loading="listLoading"
      >
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push('/rules/create')">
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table v-bind="rulesTable" :data="tableData" class="data-list">
          <el-table-column prop="id" label="ID">
            <template slot-scope="{ row }">
              <router-link
                :to="{
                  path: `/rules/${row.id}`,
                  query: { oper: 'view' },
                }"
              >{{ row.id }}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="for"
            :label="$t('RuleEngine.topic')"
          ></el-table-column>
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
          <el-table-column
            prop="status"
            :label="$t('RuleEngine.status')"
          >
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
          <el-table-column width="120px" prop="id">
            <template slot-scope="{ row }">
              <el-button
                type="dashed"
                size="mini"
                @click="editRule(row)"
              >
                {{ $t('RuleEngine.edit') }}
              </el-button>
              <el-button
                type="dashed danger"
                size="mini"
                @click="deleteRule(row)"
              >
                {{ $t('RuleEngine.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>

    <a-drawer
      v-bind="rulesDrawer"
      placement="right"
      closable
      :visible="metricsDrawerVisible"
      @close="onMetricsClose"
    >
      <div class="rule-metrics">
        <div class="metrics-item">
          <div class="metrics-item-title">
            {{ $t('RuleEngine.ruleMetrics') }}
          </div>
          <ul class="metrics-item-body field-info rule-metrics">

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.matched') }}:
              </div>
              <span class="field-value">
                {{ currentRules.metricsData.matched }}
                <span class="unit">{{ $t('RuleEngine.times') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.currentSpeed') }}:
              </div>

              <span class="field-value">
                {{ currentRules.metricsData.speed }}
                <span class="unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.maximumSpeed') }}:
              </div>
              <span class="field-value">
                {{ currentRules.metricsData.speed_max }}
                <span class="unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>

            <li class="field-info-item">
              <div class="field-title">
                {{ $t('RuleEngine.last5MinutesSpeed') }}:
              </div>
              <span class="field-value">
                {{ currentRules.metricsData.speed_last5m }}
                <span class="unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>
          </ul>
        </div>

        <div class="metrics-item">
          <div class="metrics-item-title">{{ $t('RuleEngine.actionMetrics') }}</div>

          <template v-if="currentRules.actions.length === 0">

          </template>

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
                <div class="field-title">
                  {{ $t('RuleEngine.fail') }}:
                </div>
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
  loadRules, loadRuleDetails, loadActions, destroyRule,
  loadRuleEvents, updateRule,
} from '@/api/rules'
import { getLink } from '@/common/utils'

export default {
  name: 'Rules',

  props: {},

  data() {
    return {
      docs: {
        tutorial: getLink('ruleEngineTutorial'),
        docs: '',
      },
      listLoading: false,
      metricsDrawerVisible: false,
      currentRules: {
        actions: [{
          id: 'do_nothing_1562653876521962460',
          metrics: [{ failed: 0, node: 'emqx@127.0.0.1', success: 3 }],
          name: 'do_nothing',
          params: {},
        }],
        description: '',
        enabled: true,
        for: ['client.connected'],
        id: 'rule:33570eea',
        metrics: [{
          matched: 3, node: 'emqx@127.0.0.1', speed: 0, speed_last5m: 0, speed_max: 0.1,
        }],
        rawsql: 'SELECT * FROM "client.connected"',
        event: {
          columns: ['clientid', 'username', 'event', 'auth_result', 'clean_start', 'connack', 'connected_at', 'is_bridge', 'keepalive', 'mountpoint', 'peername', 'proto_ver', 'timestamp', 'node'],
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
          matched: 3, speed: 0, speed_last5m: 0, speed_max: 0.1,
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
        return cellValue.map($ => $._name).join(',')
      },
    }
  },

  async created() {
    const events = await loadRuleEvents()
    this.filterOptions.for = events.map($ => ({ text: $.event, value: $.event }))
    this.loadActionsFilter().then(this.loadData)
  },

  methods: {
    deleteRule(row) {
      this.$msgbox.confirm(this.$t('RuleEngine.deleteRuleConfirm'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        await destroyRule(row.id)
        this.loadData()
        this.$message.success(this.$t('RuleEngine.successfulDeletion'))
      }).catch(() => {})
    },

    forColumnFilter(value, row) {
      return (row.for || []).includes(value)
    },

    actionsColumnFilter(value, row) {
      return (row.actions || []).find($ => $.name === value)
    },

    async loadData() {
      const tableData = await loadRules()
      tableData.forEach((rule) => {
        rule.actions.forEach((action) => {
          action._name = this.actionsMap[action.name]
        })
      })
      this.tableData = tableData
    },

    async loadActionsFilter() {
      const actions = await loadActions({
        fillI18n: true,
      })
      this.filterOptions.actions = actions.map($ => ({ text: $.title, value: $.name }))

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

    onMetricsClose() {
      this.metricsDrawerVisible = false
    },

    async updateRule(row) {
      const { id, enabled } = row
      updateRule(id, { enabled }).then((res) => {
        if (res) {
          const msg = enabled ? this.$t('RuleEngine.ruleEnabled') : this.$t('RuleEngine.ruleDisabled')
          this.$message.success(msg)
        }
      }).catch(() => {
        row.enabled = row.enabled !== true
      })
    },
    editRule(row) {
      this.$router.push(`/rules/create?rule=${row.id}`)
    },
  },
}
</script>


<style lang="scss" scoped>
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
</style>
