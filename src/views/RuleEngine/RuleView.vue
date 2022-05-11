<template>
  <div class="rule-view">
    <page-header>
      <div class="page-header-title-view">
        <div class="title">
          {{ ruleId }}
        </div>
      </div>

      <div class="page-header-top-start btn">
        <el-button size="small" @click="copyRule">
          {{ $t('RuleEngine.duplicate') }}
        </el-button>
        <el-button size="small" type="primary" plain @click="resetStatistics">
          {{ $t('RuleEngine.resetRuleStatistics') }}
        </el-button>
        <el-button type="danger" size="small" @click="deleteRule">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </page-header>

    <div class="emq-list-body rule-wrapper app-wrapper">
      <!-- 运行统计 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.runningMetrics') }}
          <i class="btn btn-default" :class="reloading ? 'el-icon-loading' : 'el-icon-refresh'" @click="refreshData">
          </i>
        </div>

        <el-row :gutter="40" class="metrics-wrapper">
          <el-col class="metrics-card" :span="4">
            <div class="card-title">
              {{ $t('RuleEngine.numberOfHits') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.matched }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.numberOfRulesExecutedAfterEnabling') }}
            </div>
          </el-col>
          <el-col class="metrics-card" :span="4">
            <div class="card-title">
              {{ $t('RuleEngine.sqlPassed') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.passed }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.sqlPassedDesc') }}
            </div>
          </el-col>
          <el-col class="metrics-card" :span="4">
            <div class="card-title">
              {{ $t('RuleEngine.sqlFailed') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.exception }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.sqlFailedDesc') }}
            </div>
          </el-col>
          <el-col class="metrics-card" :span="4">
            <div class="card-title">
              {{ $t('RuleEngine.sqlNoResult') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.no_result }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.sqlNoResultDesc') }}
            </div>
          </el-col>
          <el-col class="metrics-card" :span="4">
            <div class="card-title">
              {{ $t('RuleEngine.currentSpeed') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.speed }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.maximumSpeed') }}: {{ record.metricsData.speed_max }} {{ $t('RuleEngine.times') }}/{{
                $t('RuleEngine.second')
              }}
            </div>
          </el-col>

          <el-col class="metrics-card last-child" :span="4">
            <div class="card-title">
              {{ $t('RuleEngine.last5MinutesSpeed') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.speed_last5m }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.averageExecutionSpeedInTheLast5Minutes') }}
            </div>
          </el-col>

          <el-col :span="24">
            <rule-metrics-table :metrics="record.metrics"></rule-metrics-table>
          </el-col>
        </el-row>
      </a-card>

      <!-- 基本信息 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.basicInfo') }}
        </div>

        <ul class="field-info">
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.topic') }}:</div>
            <span v-if="configItem.events" class="field-value">
              <span v-for="(event, index) in configItem.events" :key="index">
                {{ event.title }} ({{ event.event }})
              </span>
            </span>
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.resourceDes') }}:</div>
            <span class="field-value">{{ configItem.description }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.selectFiled') }}:</div>
            <span class="field-value">{{ configItem.fields }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.selectConditions') }}:</div>
            <span class="field-value">{{ configItem.where }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.rule') }} SQL:</div>
            <div class="field-content">
              <code-view v-if="record.rawsql" lang="sql" :code="record.rawsql"></code-view>
            </div>
          </li>
        </ul>
      </a-card>

      <!-- 响应动作 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.responseAction') }}
          <span class="sub-title">
            {{ $t('RuleEngine.messageProcessingForHitRules') }}
          </span>
        </div>

        <rule-actions ref="ruleActions" v-model="record.actions" disabled></rule-actions>
      </a-card>
    </div>
  </div>
</template>

<script>
import { loadRuleDetails, destroyRule, resetRuleStatistics } from '@/api/rules'
import CodeView from '@/components/CodeView'
import RuleMetricsTable from './components/RuleMetricsTable'
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleView',

  components: { RuleMetricsTable, CodeView, RuleActions },

  props: {},

  data() {
    return {
      loading: true,
      timer: 0,
      record: {
        for: [],
        actions: [],
        metricsData: {
          matched: 0,
          speed: 0,
          speed_last5m: 0,
          speed_max: 0,
        },
        metrics: [],
      },
    }
  },
  computed: {
    reloading() {
      return this.$store.state.loading
    },
    ruleId() {
      return this.$route.params.id
    },
    configItem() {
      if (!this.record.id) {
        return {
          event: {},
        }
      }
      const { rawsql = '' } = this.record
      const sql = rawsql.replace(/\n/g, ' ')
      const reField = sql.match(/SELECT (.+) FROM/i)
      const fields = reField ? reField[1] : '*'
      const reWhere = sql.match(/(.|\n)+WHERE (?<where>(.|\n)+)/i)
      const where = reWhere && reWhere.groups && reWhere.groups.where ? reWhere.groups.where : ''
      return {
        fields,
        where,
        ...this.record,
      }
    },
  },

  watch: {
    $route() {
      this.record.rawsql = ''
      this.loadData()
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    refreshData() {
      this.loadData()
      this.$refs.ruleActions.loadActions()
    },
    async loadData() {
      this.record = await loadRuleDetails(this.ruleId)
      this.loading = false
    },
    deleteRule() {
      this.$msgbox
        .confirm(this.$t('RuleEngine.deleteRuleConfirm'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyRule(this.record.id)
          this.$message.success(this.$t('Base.deleteSuccess'))
          setTimeout(() => {
            this.$router.push({ path: '/rules' })
          }, 500)
        })
        .catch(() => {})
    },
    async resetStatistics() {
      await this.$msgbox.confirm(this.$t('RuleEngine.resetRuleStatisticsConfirm'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
      await resetRuleStatistics(this.ruleId)
      this.$message.success(this.$t('RuleEngine.resetSuccessfully'))
      this.loadData()
    },

    copyRule() {
      this.$router.push({ name: 'rules-create', query: { command: 'copy', rule: this.ruleId } })
    },
  },
}
</script>

<style lang="scss">
.rule-view {
  @import './style.scss';

  .field-title {
    width: 100px;
  }

  .el-button--primary.is-plain {
    background-color: transparent;
    &:hover {
      background-color: #34c388;
    }
  }

  .rule-metrics-table {
    margin-top: 20px;
  }
}
</style>
