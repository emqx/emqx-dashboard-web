<template>
  <div class="rule-create">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              首页
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/rules" tag="span" class="btn btn-default raw">
              规则引擎
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              创建
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">创建规则</div>
        </div>

        <!--<div class="page-header-content-view">-->
        <!--<div class="content">-->

        <!--</div>-->
        <!--</div>-->
      </div>
    </div>

    <div class="emq-list-body rule-wrapper app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-title">
          条件
          <span class="sub-title">
              使用 SQL 定义规则条件与数据处理方式
            </span>
        </div>

        <el-row :gutter="20">
          <el-col :span="15">
            <el-form
              ref="record"
              :model="record"
              :rules="rules"
              label-width="120px"
              label-position="left"
              size="small"
              label-suffix=":"
            >

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

              <!--<el-form-item v-if="selectEvent.ctx.topic" prop="topic" label="主题">-->
              <!--<el-autocomplete-->
              <!--v-model="record.topic"-->
              <!--:fetch-suggestions="topicSearch"-->
              <!--placeholder="e.g t/#"-->
              <!--@select="handleTopicSelect"-->
              <!--&gt;-->
              <!--<template slot-scope="{ item }">-->
              <!--<div class="name">{{ item.topic }}</div>-->
              <!--</template>-->
              <!--</el-autocomplete>-->
              <!--<el-popover placement="top" trigger="hover">-->
              <!--规则要处理的主题，支持 MQTT 主题通配符 '+'、'#'-->
              <!--<i slot="reference" class="icon el-icon-question"></i>-->
              <!--</el-popover>-->
              <!--</el-form-item>-->

              <el-form-item>
                <template slot="label">
                  &nbsp;
                </template>
                <!--<code-view v-if="rawsqlVisible" lang="sql" :code="rawSQL"></code-view>-->
                <div class="code code-border">
                  <code>{{ rawSQL }}</code>
                </div>
              </el-form-item>


              <el-form-item prop="field" label="查询字段">
                <el-input v-model="record.field" type="textarea" :rows="4" placeholder="e.g payload.speed"></el-input>
                <!--<span class="tips btn btn-default" @click="toggleTips">可用字段</span>-->
              </el-form-item>


              <el-form-item prop="tiaojian" label="筛选条件">
                <el-input v-model="record.tiaojian" placeholder="e.g payload.speed > 60"></el-input>
              </el-form-item>

              <el-form-item label="SQL测试">
                <el-switch v-model="showTest" @change="handlePreSQLTest"></el-switch>
                <el-popover placement="top" trigger="hover">
                  输入元数据进行 SQL 匹配测试
                  <i slot="reference" class="icon el-icon-question"></i>
                </el-popover>
              </el-form-item>

              <el-collapse-transition>
                <div v-if="showTest">
                  <el-form-item
                    v-for="(field, i) in testField"
                    :key="i"
                    :prop="`ctx.${field}`"
                    :label="field"
                  >
                    <el-input
                      v-model="record.ctx[field]"
                      :type="field === 'payload' ? 'textarea' : ''"
                      :rows="5"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item>
                    <span slot="label">&nbsp;</span>
                    <el-button type="primary" @click="handleSQLTest">测 试</el-button>
                  </el-form-item>

                  <el-form-item label="测试输出">
                    <el-input v-model="testOutPut" type="textarea" readonly :rows="4"></el-input>
                    <!--<code-view :code="testOutPut" lang="json"></code-view>-->
                  </el-form-item>


                </div>
              </el-collapse-transition>
            </el-form>
          </el-col>

          <el-col :span="9" class="tips-form">
            <div style="color: #606266">当前事件可用字段</div>
            <div class="tips-wrapper code">
             <span
               v-for="key in availableFields"
               :key="key"
               class="available-fields"
               @click="selectAvailableFields(key)"
             >
               {{ key }}
             </span>
            </div>
          </el-col>
        </el-row>


      </a-card>


      <a-card class="emq-list-card">
        <div class="emq-title">
          <div class="title required-title">
            响应动作
          </div>
          <span class="sub-title">
            处理命中规则的消息
          </span>
        </div>

        <div class="rule-action-wrapper">
          <rule-actions v-model="record.actions" :event="record.for"></rule-actions>
        </div>
      </a-card>


      <div style="text-align: center">
        <el-button type="primary" size="medium" @click="handleCreate">
          创 建
        </el-button>
        <el-button type="default" size="medium" @click="$router.push({ path: '/rules' })">
          取 消
        </el-button>
      </div>


    </div>


  </div>
</template>


<script>
import {
  loadEventsSelect, loadEvents, SQLTest, createRule,
} from '@/api/rules'
import { loadTopics } from '@/api/server'
import CodeView from '@/components/CodeView'
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleCrate',

  components: { RuleActions, CodeView },

  props: {},

  data() {
    const that = this
    return {
      loadEventsSelect,
      topics: [],
      events: [],
      testOutPut: '',
      selectEvent: {
        name: '',
        value: '',
        description: '',
        test_field: [],
        ctx: {},
        sql: '',
      },
      timer: 0,
      showTips: false,
      showTest: false,
      rawsqlVisible: true,
      record: {
        for: '',
        rawsql: '',
        // topic: '',
        field: '*',
        actions: [],
        description: '',
        ctx: {},
        tiaojian: ''
      },
      rules: {
        for: { required: true, message: '请选择触发事件' },
        // topic: { required: true, message: '请输入主题' },
        ctx: {},
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
      const fields = field.replace(/[\n\b\t]/g, '').split(',').join(', ') || '*'
      let where = ''
      // if (topicField) {
      //   where = `topic =~ '${topic || '#'}'`
      //   if (tiaojian) {
      //     where += ` AND ${tiaojian}`
      //   }
      // } else
      if (tiaojian) {
        where = ` WHERE ${tiaojian}`
      }
      return `SELECT ${fields} FROM "${value}"${where ? `${where}` : ''}`
    },
    availableFields() {
      return Object.keys(this.selectEvent.ctx)
    },
    testField() {
      return this.selectEvent.test_field
    },
  },

  async created() {
    this.events = loadEvents()
    this.selectEvent = this.events[0]
    this.record.for = this.selectEvent.value
    if (this.selectEvent.ctx.payload) {
      this.record.topic = '#'
    }

    const data = await loadTopics()
    this.topics = data.items || []
  },

  methods: {
    async handleCreate() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      if (this.record.actions.length === 0) {
        this.$message.error('请添加响应动作')
        return
      }
      const record = {
        for: this.record.for,
        rawsql: this.rawSQL,
        actions: this.record.actions.map($ => ({ name: $.name, params: $.params })),
        description: this.record.description,
      }
      createRule(record).then(() => {
        this.$message.success('创建成功')
        setTimeout(() => {
          this.$router.push({ path: '/rules' })
        }, 600)
      })
    },
    handleSQLTest() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        const record = JSON.parse(JSON.stringify(this.record))
        this.testOutPut = ''

        try {
          record.ctx.payload = JSON.stringify(JSON.parse(record.ctx.payload))
        } catch (e) {
        }
        record.rawsql = this.rawSQL
        SQLTest(record).then((resp) => {
          this.testOutPut = JSON.stringify(resp, null, 2)
        }).catch((e) => {
          if (e === 'SQL Not Match') {
            this.testOutPut = '输出为空'
          } else {
            this.testOutPut = 'SQL 错误请检查'
          }
        })
      })
    },
    handlePreSQLTest() {
      this.record.ctx = {}
      const { ctx, test_field: testField } = this.selectEvent
      if (this.showTest) {
        testField.forEach((k) => {
          let v = ctx[k]
          if (typeof v === 'object') {
            v = JSON.stringify(v, null, 2)
          }
          this.$set(this.record.ctx, k, v)
        })
      }
    },
    selectAvailableFields(key) {
      const { field } = this.record
      let dot = field.endsWith(',') ? ' ' : ', '
      if (field.trim() === '') {
        dot = ''
      }
      if (field.trim() === '*') {
        this.record.field = ''
        dot = ''
      }
      this.record.field += (`${dot}${key}`)
    },
    toggleTips() {
      this.showTips = !this.showTips
    },
    handleForChange(val) {
      this.selectEvent = this.events.find($ => $.value === val)
      if (this.selectEvent.ctx.payload) {
        this.record.topic = '#'
      }
      this.record.field = '*'
      this.record.tiaojian = ''
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


<style lang="scss">
@import "./style.less";

.rule-create {
  @import "./style.less";

  .available-fields {
    transition: all .3s;
    border-bottom: 1px dashed #fff;
    padding-bottom: 3px;
    position: relative;
    margin-right: 8px;
    user-select: none;

    &:hover {
      color: #333;
      border-bottom: 1px dashed #d8d8d8;
    }
  }

  .rule-create-footer {
    height: 60px;
    background-color: #fff;
    margin-top: 24px;
    text-align: center;

    .el-button {
      min-width: 80px;
    }
  }

  .required-title {
    &:after {
      content: '*';
      color: #F5222D;
      margin-right: 4px;
    }
  }
  .tips-wrapper {
    width: 100% !important;
    word-break: break-word;
    padding: 6px 0 0 0 ;
  }
  .tips-form {
    padding-top: 4px;
  }
}
</style>
