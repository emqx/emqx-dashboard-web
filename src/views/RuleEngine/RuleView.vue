<template>
  <div class="rule-view">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              {{ $t('RuleEngine.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/rules" tag="span">
              {{ $t('RuleEngine.ruleEngine') }}
            </router-link>
          </a-breadcrumb-item>


          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.details') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            {{ ruleId }}
          </div>
        </div>
      </div>
    </div>


    <div class="emq-list-body rule-wrapper app-wrapper">
      <!-- 运行统计 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.runningMetrics') }}
        </div>

        <el-row :gutter="40" class="metrics-wrapper">
          <el-col class="metrics-card" :span="8">
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
          <el-col class="metrics-card" :span="8">
            <div class="card-title">
              {{ $t('RuleEngine.currentSpeed') }}
            </div>
            <div class="card-value">
              {{ record.metricsData.speed }}
              <span class="card-unit">{{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}</span>
            </div>
            <div class="card-desc">
              {{ $t('RuleEngine.maximumSpeed') }}: {{ record.metricsData.speed_max }} {{ $t('RuleEngine.times') }}/{{ $t('RuleEngine.second') }}
            </div>
          </el-col>

          <el-col class="metrics-card last-child" :span="8">
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
        </el-row>
      </a-card>


      <!-- 基本信息 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.basicInfo') }}
        </div>

        <ul class="field-info">
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.triggerEvent') }}:</div>
            <span class="field-value">{{ configItem.event.name }} ({{ record.for[0] }})</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.remark') }}:</div>
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

        <rule-actions
          v-model="record.actions"
          disabled
        ></rule-actions>
      </a-card>
    </div>


  </div>
</template>


<script>
import { loadRuleDetails, loadEvents } from '@/api/rules'
import CodeView from '@/components/CodeView'
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleView',

  components: { CodeView, RuleActions },

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
      eventsMap: {},
      actions: [],
    }
  },
  computed: {
    ruleId() {
      return this.$route.params.id
    },
    configItem() {
      if (!this.record.id) {
        return {
          event: {},
        }
      }
      const { for: value, rawsql = '' } = this.record
      const sql = rawsql.replace(/\n/g, ' ')
      const reField = sql.match(/SELECT (.+) FROM/)
      const fields = reField ? reField[1] : '*'
      const reWhere = sql.split(' WHERE ')
      const where = reWhere && reWhere[1] ? reWhere[1] : ''
      const event = this.eventsMap[value] || {}
      return {
        fields,
        where,
        event,
        ...this.record,
      }
    },
  },

  watch: {
    $route() {
      this.loadData()
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const record = await loadRuleDetails(this.ruleId)
      const events = await loadEvents()
      events.forEach((event) => {
        this.eventsMap[event.value] = event
      })
      record.metricsData = {}
      record.metrics.forEach((item) => {
        ['matched', 'speed', 'speed_last5m', 'speed_max'].forEach((key) => {
          record.metricsData[key] = record.metricsData[key] || 0
          record.metricsData[key] += item[key] || 0
        })
      })
      this.loading = false
      this.record = record
    },
  },
}
</script>


<style lang="scss">
.rule-view {
  @import "./style.less";

  .field-title {
    width: 80px;
  }
}
</style>
