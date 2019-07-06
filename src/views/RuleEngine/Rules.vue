<template>
  <div class="rules">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              首页
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              规则引擎
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">规则引擎</div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              规则引擎使用说起来语句配置二面消息流与设备事件的处理规则，内置多种灵活的数据处理方案。
            </p>
            <div class="page-header-link">
              <a :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-position"></i>
                快速开始
              </a>

              <a :href="docs.tutorial" target="_blank" class="link-item">
                <i class="icon el-icon-document"></i>
                产品文档
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
            创建
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
          <el-table-column prop="metrics" label="监控">
            <template slot-scope="{ row }">
              <i class="iconfont icon-tubiao-zhuzhuangtu btn btn-default" @click="showMetrics(row)"></i>
            </template>
          </el-table-column>
          <el-table-column prop="description" show-overflow-tooltip label="描述"></el-table-column>
          <el-table-column
            prop="for"
            :filters="filterOptions.for"
            :filter-method="forColumnFilter"
            filter-placement="bottom"
            label="触发事件"
          ></el-table-column>
          <el-table-column
            prop="actions"
            :filters="filterOptions.actions"
            :filter-method="actionsColumnFilter"
            filter-placement="bottom"
            :formatter="actionsFormatter"
            label="响应动作"
          >
          </el-table-column>
          <el-table-column width="80px" prop="id">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="deleteRule(row)">删除</el-button>
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
          <div class="metrics-item-title">规则统计</div>
          <ul class="metrics-item-body value-item-wrapper">
            <li class="value-item">
              命中次数:
              <span class="value">
                {{ currentRules.metrics.matched }}
                <span class="unit">次</span>
              </span>
            </li>
            <li class="value-item">
              当前执行速度:
              <span class="value">
                {{ currentRules.metrics.speed }}
                <span class="unit">次/秒</span>
              </span>
            </li>
            <li class="value-item">
              最大执行速度:
              <span class="value">
                {{ currentRules.metrics.speed_max }}
                <span class="unit">次/秒</span>
              </span>
            </li>
            <li class="value-item">
              最近5分钟执行速度:
              <span class="value">
                {{ currentRules.metrics.speed_last5m }}
                <span class="unit">次/秒</span>
              </span>
            </li>
          </ul>
        </div>

        <div class="metrics-item">
          <div class="metrics-item-title">动作统计</div>

          <template v-if="currentRules.actions.length === 0">

          </template>

          <ul v-for="(item, i) in currentRules.actions" :key="i" class="metrics-item-body value-item-wrapper">
            <div class="value-item value-item-title">
              {{ item.name }}


              <li class="value-item">
                成功:
                <span class="value">
                  {{ item.metrics.success }}
                </span>
              </li>

              <li class="value-item">
                失败:
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
      this.$msgbox.confirm('此操作将停用并删除该规则,确认继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await destroyRule(row.id)
        this.loadData()
        this.$message.success('删除成功')
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
