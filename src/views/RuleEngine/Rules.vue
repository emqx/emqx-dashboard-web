<template>
  <div class="rules">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              {{ $t('RuleEngine.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.ruleEngine') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">{{ $t('RuleEngine.ruleEngine') }}</div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              {{ $t('RuleEngine.definingRuleConditionsAndDataProcessing') }}
            </p>
            <div class="page-header-link">
              <a :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-position"></i>
                {{ $t('RuleEngine.quickStart') }}
              </a>

              <a :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-document"></i>
                {{ $t('RuleEngine.productDocumentation') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
        :loading="listLoading"
      >
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push('/rules/create')">
            {{ $t('RuleEngine.create') }}
          </el-button>
        </div>

        <el-table v-bind="rulesTable" :data="tableData" class="data-list">
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="55">-->
          <!--</el-table-column>-->
          <el-table-column prop="id" label="ID">
            <template slot-scope="{ row }">
              <router-link :to="{ path: `/rules/${row.id}` }">{{ row.id }}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="metrics" :label="$t('RuleEngine.monitor')">
            <template slot-scope="{ row }">
              <i class="iconfont icon-tubiao-zhuzhuangtu btn btn-default" @click="showMetrics(row)"></i>
            </template>
          </el-table-column>
          <el-table-column prop="description" show-overflow-tooltip :label="$t('RuleEngine.describe')"></el-table-column>
          <el-table-column
            prop="for"
            :filters="filterOptions.for"
            :filter-method="forColumnFilter"
            filter-placement="bottom"
            :label="$t('RuleEngine.triggerEvent')"
          ></el-table-column>
          <el-table-column
            prop="actions"
            :filters="filterOptions.actions"
            :filter-method="actionsColumnFilter"
            filter-placement="bottom"
            :formatter="actionsFormatter"
            :label="$t('RuleEngine.responseAction')"
          >
          </el-table-column>
          <el-table-column width="80px" prop="id">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="deleteRule(row)">{{ $t('RuleEngine.delete') }}</el-button>
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
          <div class="metrics-item-title">{{ $t('RuleEngine.ruleMetrics') }}</div>
          <ul class="metrics-item-body value-item-wrapper">
            <li class="value-item">
              {{ $t('RuleEngine.matched') }}:
              <span class="value">
                {{ currentRules.metrics.matched }}
                <span class="unit">{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>
            <li class="value-item">
              {{ $t('RuleEngine.currentSpeed') }}:
              <span class="value">
                {{ currentRules.metrics.speed }}
                <span class="unit">{{ $t('RuleEngine.second') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>
            <li class="value-item">
              {{ $t('RuleEngine.maximumSpeed') }}:
              <span class="value">
                {{ currentRules.metrics.speed_max }}
                <span class="unit">{{ $t('RuleEngine.second') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>
            <li class="value-item">
              {{ $t('RuleEngine.last5MinutesSpeed') }}:
              <span class="value">
                {{ currentRules.metrics.speed_last5m }}
                <span class="unit">{{ $t('RuleEngine.second') }}/{{ $t('RuleEngine.second') }}</span>
              </span>
            </li>
          </ul>
        </div>

        <div class="metrics-item">
          <div class="metrics-item-title">{{ $t('RuleEngine.actionMetrics') }}</div>

          <template v-if="currentRules.actions.length === 0">

          </template>

          <ul v-for="(item, i) in currentRules.actions" :key="i" class="metrics-item-body value-item-wrapper">
            <div class="value-item value-item-title">
              {{ item.name }}


              <li class="value-item">
                {{ $t('RuleEngine.success') }}:
                <span class="value">
                  {{ item.metrics.success }}
                </span>
              </li>

              <li class="value-item">
                {{ $t('RuleEngine.fail') }}:
                <span class="value">
                  {{ item.metrics.failed }}
                </span>
              </li>

            </div>

          </ul>


        </div>


      </div>
    </a-drawer>
  </div>
</template>


<script>
import {
  loadRules, loadRuleDetails, loadActions, destroyRule,
  loadEventsSelect,
} from '@/api/rules'
import CodeView from '@/components/CodeView'
import { getLink } from '@/common/utils'

export default {
  name: 'Rules',

  components: { CodeView },

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
        metrics: {
          matched: 0,
          speed: 0,
          speed_last5m: 0,
          speed_max: 0,
        },
        actions: [
          // {
          //   metrics: {
          //     failed: 0,
          //     success: 0,
          //   },
          //   name: 'inspect',
          //   params: {},
          // },
        ],
      },
      filterOptions: {
        for: loadEventsSelect().map($ => ({ text: $.value, value: $.value })),
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

  created() {
    this.loadActionsFilter().then(this.loadData)
  },

  methods: {
    deleteRule(row) {
      this.$msgbox.confirm(this.$t('RuleEngine.deleteRuleConfirm'), {
        confirmButtonText: this.$t('RuleEngine.confirm'),
        cancelButtonText: this.$t('RuleEngine.cancel'),
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
  },
}
</script>


<style lang="scss" scoped>
.rules {
}

.link-item {
  .icon {
    width: 24px;
    height: 24px;
    line-height: 14px;
    border-radius: 50%;
    border: 1px solid #34C388;
    padding: 4px;
    text-align: center;
    margin-right: 8px;
    font-size: 12px;
  }
}

.description {
  max-width: 500px;
}

.rule-metrics {
  .metrics-item {
    margin-bottom: 50px;

    .metrics-item-title {
      font-size: 14px;
      font-weight: bold;
      color: #101010;
    }

    .value-item-wrapper {
      margin-top: 24px;
    }
  }
}

.value-item-wrapper {
  display: block;
  list-style-type: disc;
  padding: 0;
  margin: 0;

  .value-item {
    list-style-type: none;
    font-size: 12px;
    color: #808080;
    margin-bottom: 8px;

    &.value-item-title {
      color: #000;

      & > .value-item {
        margin-top: 8px;
      }

      .value-item {
        padding-left: 10px;
      }
    }

    .value {
      color: #000;
      cursor: pointer;

      &:hover {
        border-bottom: 1px dashed #d8d8d8;
      }
    }
  }
}
</style>
