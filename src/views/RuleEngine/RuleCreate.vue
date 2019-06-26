<template>
  <div class="rule-create">
    <a-card class="emq-list-card">
      <template slot="title">
        <div class="back-btn" @click="$router.push({ path: '/rules/list' })">
          规则列表
        </div>
        <span class="title">创建规则</span>
      </template>

      <div class="emq-list-body rule-create-wrapper">
        <el-form
          ref="record"
          :model="record"
          :rules="rules"
          label-width="120px"
          label-position="right"
          size="small"
          label-suffix=":"
        >
          <div class="emq-title">
            条件
            <span class="sub-title">
              使用 SQL 定义规则条件与数据处理方式
            </span>
          </div>
          <el-form-item prop="for" label="触发事件">
            <emq-select v-model="record.for" :field="{ api: loadEventsSelect }" @change="handleForChange">
              <div slot="option" slot-scope="{ item }" class="emq-option-item">
                <span class="option-label">{{ item.label }}</span>
                <span class="option-value">{{ item.value }}</span>
              </div>
            </emq-select>
          </el-form-item>

          <el-form-item prop="description" label="备注">
            <el-input v-model="record.description"></el-input>
          </el-form-item>

          <el-form-item v-if="selectEvent.ctx.topic" prop="topic" label="主题">
            <el-autocomplete
              v-model="record.topic"
              :fetch-suggestions="topicSearch"
              placeholder="e.g t/#"
              @select="handleTopicSelect"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.topic }}</div>
              </template>
            </el-autocomplete>
            <el-popover placement="top" trigger="hover">
              规则要处理的主题，支持 MQTT 主题通配符 '+'、'#'
              <i slot="reference" class="icon el-icon-question"></i>
            </el-popover>
          </el-form-item>

          <el-form-item>
            <template slot="label">
              &nbsp;
            </template>
            <!--<code-view v-if="rawsqlVisible" lang="sql" :code="rawSQL"></code-view>-->
            <div class="code">
              <code>{{ rawSQL }}</code>
            </div>
          </el-form-item>


          <el-form-item prop="field" label="查询字段">
            <el-input v-model="record.field" type="textarea" :rows="4"></el-input>
          </el-form-item>

          <el-form-item prop="tiaojian" label="筛选条件">
            <el-input v-model="record.tiaojian" placeholder="e.g payload.speed > 60"></el-input>
          </el-form-item>

          <el-form-item label="SQL测试">
            <el-switch v-model="record.test"></el-switch>
            <el-popover placement="top" trigger="hover">
              输入元数据进行 SQL 匹配测试
              <i slot="reference" class="icon el-icon-question"></i>
            </el-popover>
          </el-form-item>


          <div class="line"></div>

          <div class="emq-title">
            响应动作
            <span class="sub-title">
              处理命中规则的消息
            </span>
          </div>

        </el-form>
      </div>
    </a-card>
  </div>
</template>


<script>
import { loadEventsSelect, loadEvents } from '@/api/rules'
import { loadTopics } from '@/api/server'
import CodeView from '@/components/CodeView'

export default {
  name: 'RuleCrate',

  components: { CodeView },

  props: {},

  data() {
    const that = this
    return {
      loadEventsSelect,
      topics: [],
      events: [],
      selectEvent: {
        name: '',
        value: '',
        description: '',
        test_field: [],
        ctx: {},
        sql: '',
      },
      timer: 0,
      rawsqlVisible: true,
      record: {
        for: '',
        rawsql: '',
        topic: '',
        field: '',
        actions: [
          // {
          //   name: 'inspect',
          //   params: {},
          // },
        ],
        description: '',
        ctx: {},
      },
      rules: {
        for: { required: true, message: '请选择触发事件' },
        topic: { required: true, message: '请输入主题' },
        tiaojian: { required: true, message: '请输入条件' },
        field: [
          { required: true, message: '请输入查询字段' },
          {
            validator(rule, value, cb) {
              if (value.trim() === '*') {
                return cb()
              }
              const fields = value.replace(/[\n\b]/g, '').split(/,/)
              // 空字符错误
              const fieldError = fields.find($ => !$)
              if (fieldError !== undefined) {
                return cb(new Error('字段填写错误'))
              }
              cb()
            },
          },
        ],
      },
    }
  },

  computed: {
    rawSQL() {
      const { value, ctx: { topic: topicField } } = this.selectEvent
      const { topic, field, tiaojian } = this.record
      const fields = field.replace(/[\n\b\t]/g, '').split(',').join(',') || '*'
      let where = ''
      if (topicField) {
        where = `topic =~ '${topic || '#'}'`
        if (tiaojian) {
          where += ` AND ${tiaojian}`
        }
      } else if (tiaojian) {
        where = `${tiaojian}`
      }
      return `SELECT ${fields} FROM "${value}"${where ? ` WHERE ${where}` : ''}`
    },
  },

  async created() {
    this.events = loadEvents()
    this.selectEvent = this.events[0]
    this.record.for = this.selectEvent.value

    const data = await loadTopics()
    this.topics = data.items || []
  },

  methods: {
    handleForChange(val) {
      this.selectEvent = this.events.find($ => $.value === val)
    },
    topicSearch(queryString, cb) {
      clearTimeout(this.timer)
      if (!this.topics.length || !queryString) {
        return cb([])
      }
      this.timer = setTimeout(() => {
        const matchItems = this.topics.filter($ => $.topic.includes(queryString), // || queryString.includes($.topic)
        ).sort(($1, $2) => ($1.toString().length > $2.toString().length ? -1 : 1))
        cb(matchItems)
      }, 300)
    },
    handleTopicSelect(item) {
      this.record.topic = item.topic
    },
  },
}
</script>


<style lang="scss" scoped>
.rule-create {
}

.rule-create-wrapper {
  .emq-title {
    margin-bottom: 40px;
  }

  .el-form-item {
    padding-left: 32px;
    /*width: 540px;*/
  }

  .el-input,
  .el-select,
  .el-autocomplete,
  .el-textarea,
  .code-view,
  .code {
    width: 600px;
  }

  .code {
    font-size: 13px;
  }

  .icon {
    margin-left: 12px;
  }

  .line {
    width: 1000px;
    margin: 30px auto 40px auto;
    background-color: #d8d8d8;
  }
}
</style>
