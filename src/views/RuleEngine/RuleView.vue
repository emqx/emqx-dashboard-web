<template>
  <div class="rule-view">
    <a-card class="detail-title-wrapper">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/rules' }">规则列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ ruleId }}</el-breadcrumb-item>
      </el-breadcrumb>
    </a-card>


    <div class="emq-list-body rule-wrapper">
      <!-- 运行统计 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          运行统计
        </div>

        <el-row :gutter="40" class="metrics-wrapper">
          <el-col class="metrics-card" :span="8">
            <div class="card-title">
              执行次数
            </div>
            <div class="card-value">
              {{ record.metrics.matched }}
              <span class="card-unit">次</span>
            </div>
            <div class="card-desc">
              规则启用后的执行次数
            </div>
          </el-col>
          <el-col class="metrics-card" :span="8">
            <div class="card-title">
              当前速度
            </div>
            <div class="card-value">
              {{ record.metrics.speed }}
              <span class="card-unit">次/秒</span>
            </div>
            <div class="card-desc">
              最大执行速度: {{ record.metrics.speed_max }} 次/秒
            </div>
          </el-col>

          <el-col class="metrics-card last-child" :span="8">
            <div class="card-title">
              最近5分钟执行速度
            </div>
            <div class="card-value">
              {{ record.metrics.speed_last5m }}
              <span class="card-unit">次/秒</span>
            </div>
            <div class="card-desc">
              最近5分钟平均执行速度
            </div>
          </el-col>
        </el-row>
      </a-card>


      <!-- 基本信息 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          基本信息
        </div>

        <ul class="field-info">
          <li class="field-info-item">
            <div class="field-title">触发事件：</div>
            <span class="field-value">{{ configItem.event.name }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">备注：</div>
            <span class="field-value">{{ configItem.description }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">查询字段：</div>
            <span class="field-value">{{ configItem.fields }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">筛选条件：</div>
            <span class="field-value">{{ configItem.where }}</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">规则 SQL：</div>
            <div class="field-content">
              <code-view v-if="record.rawsql" lang="sql" :code="record.rawsql"></code-view>
            </div>
          </li>
        </ul>
      </a-card>


      <!-- 响应动作 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          响应动作
          <span class="sub-title">
            命中规则的消息处理方式
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
        actions: [],
        metrics: {
          matched: 0,
          speed: 0,
          speed_last5m: 0,
          speed_max: 0,
        },
      },
      eventsMap: {},
      actions: [],
    }
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
      this.loading = false
      this.record = record
    },
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
