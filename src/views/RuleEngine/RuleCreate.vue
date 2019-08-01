<template>
  <div class="rule-create">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              {{ $t('RuleEngine.homePage') }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/rules" tag="span" class="btn btn-default raw">
              {{ $t('RuleEngine.ruleEngine') }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.create') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <div class="emq-list-body rule-wrapper app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-title">
          {{ $t('RuleEngine.condition') }}
          <span class="sub-title">
            {{ $t('RuleEngine.definingRuleConditionsAndDataProcessing') }}
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

              <el-form-item prop="for" :label="$t('RuleEngine.triggerEvent')">
                <emq-select
                  v-model="record.for"
                  :field="{ api: loadRuleEvents }"
                  :field-name="{ label: 'title', value: 'event' }"
                  @change="handleForChange"
                >
                  <div slot="option" slot-scope="{ item }" class="emq-option-item">
                    <span class="option-label">{{ item.title }}</span>
                    <span class="option-value">{{ item.event }}</span>
                  </div>
                </emq-select>
              </el-form-item>

              <el-form-item prop="description" :label="$t('RuleEngine.remark')">
                <el-input v-model="record.description"></el-input>
              </el-form-item>

              <el-form-item>
                <template slot="label">
                  &nbsp;
                </template>
                <!--<code-view v-if="rawsqlVisible" lang="sql" :code="rawSQL"></code-view>-->
                <div class="code code-border">
                  <code>{{ rawSQL }}</code>
                </div>
              </el-form-item>

              <el-form-item prop="field" :label="$t('RuleEngine.selectFiled')">
                <el-input v-model="record.field" type="textarea" :rows="4" placeholder="e.g payload.speed"></el-input>
                <!--<span class="tips btn btn-default" @click="toggleTips">{{ $t('RuleEngine.availableField') }}</span>-->
              </el-form-item>

              <el-form-item prop="tiaojian" :label="$t('RuleEngine.selectConditions')">
                <el-input v-model="record.tiaojian" placeholder="e.g payload.speed > 60"></el-input>
              </el-form-item>

              <el-form-item :label="$t('RuleEngine.sqlTest')">
                <el-switch v-model="showTest" @change="handlePreSQLTest"></el-switch>
                <el-popover width="220" placement="top" trigger="hover">
                  {{ $t('RuleEngine.inputMetadata') }}
                  <i slot="reference" class="icon el-icon-question"></i>
                </el-popover>
              </el-form-item>

              <el-collapse-transition>
                <div v-if="showTest">
                  <el-form-item v-for="(field, i) in testField" :key="i" :prop="`ctx.${field}`" :label="field">
                    <el-input v-model="record.ctx[field]" :type="field === 'payload' ? 'textarea' : ''" :rows="5">
                    </el-input>
                  </el-form-item>

                  <el-form-item>
                    <span slot="label">&nbsp;</span>
                    <el-button type="primary" @click="handleSQLTest">
                      {{ $t('RuleEngine.sqlTest') }}
                    </el-button>
                  </el-form-item>

                  <el-form-item :label="$t('RuleEngine.testOutput')">
                    <el-input v-model="testOutPut" type="textarea" readonly :rows="4"></el-input>
                    <!--<code-view :code="testOutPut" lang="json"></code-view>-->
                  </el-form-item>

                </div>
              </el-collapse-transition>
            </el-form>
          </el-col>

          <el-col :span="9" class="tips-form">
            <div style="color: #606266">{{ $t('RuleEngine.currentEventAvailableField') }}</div>
            <div class="tips-wrapper code">
              <span
                v-for="key in availableFields" :key="key" class="available-fields"
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
            {{ $t('RuleEngine.responseAction') }}
          </div>
          <span class="sub-title">
            {{ $t('RuleEngine.processingMessagesForHitRules') }}
          </span>
        </div>

        <div class="rule-action-wrapper">
          <rule-actions v-model="record.actions" :event="record.for"></rule-actions>
        </div>
      </a-card>

      <div style="text-align: center">
        <el-button type="primary" size="medium" @click="handleCreate">
          {{ $t('RuleEngine.create') }}
        </el-button>
        <el-button type="default" size="medium" @click="$router.push({ path: '/rules' })">
          {{ $t('RuleEngine.cancel') }}
        </el-button>
      </div>

    </div>

  </div>
</template>


<script>
import {
  loadRuleEvents, SQLTest, createRule,
} from '@/api/rules'
import { loadTopics } from '@/api/server'
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleCrate',

  components: { RuleActions },

  props: {},

  data() {
    return {
      loadRuleEvents,
      topics: [],
      events: [],
      testOutPut: '',
      selectEvent: {
        columns: [
          'client_id',
          'username',
          'event',
          'id',
          'payload',
          'peername',
          'qos',
          'timestamp',
          'topic',
          'node',
        ],
        description: 'message publish',
        event: 'message.publish',
        sql_example: 'SELECT * FROM "message.publish" WHERE topic =~ \'t/#\'',
        test_columns: {
          client_id: 'c_emqx',
          username: 'u_emqx',
          topic: 't/a',
          qos: 1,
          payload: '{"msg": "hello"}',
        },
        title: 'message publish',
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
        tiaojian: '',
      },
      rules: {
        for: { required: true, message: this.$t('RuleEngine.pleaseSelectTheTriggerEvent') },
        // topic: { required: true, message: this.$t('RuleEngine.pleaseEnterTheTopic') },
        ctx: {},
        field: [
          { required: true, message: this.$t('RuleEngine.pleaseEnterTheSelectField') },
          {
            validator(rule, value, cb) {
              if (value.trim() === '*') {
                return cb()
              }
              const fields = value.replace(/[\n\b]/g, '').split(/,/)
              // 空字符错误
              const fieldError = fields.find($ => !$)
              if (fieldError !== undefined) {
                return cb(new Error(this.$t('RuleEngine.fieldFillingError')))
              }
              return cb()
            },
          },
        ],
      },
    }
  },

  computed: {
    rawSQL() {
      const { event } = this.selectEvent
      const { field, tiaojian } = this.record
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
      return `SELECT ${fields} FROM "${event}"${where ? `${where}` : ''}`
    },
    availableFields() {
      return this.selectEvent.columns
    },
    testField() {
      return Object.keys(this.selectEvent.test_columns)
    },
  },

  async created() {
    this.events = await loadRuleEvents()
    this.selectEvent = this.events[0]
    this.record.for = this.selectEvent.event
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
        this.$message.error(this.$t('RuleEngine.pleaseAddAResponseAction'))
        return
      }
      const record = {
        for: this.record.for,
        rawsql: this.rawSQL,
        actions: this.record.actions.map($ => ({ name: $.name, params: $.params })),
        description: this.record.description,
      }
      createRule(record).then(() => {
        this.$message.success(this.$t('RuleEngine.createSuccess'))
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
          console.log(e)
        }
        record.rawsql = this.rawSQL
        SQLTest(record).then((resp) => {
          this.testOutPut = JSON.stringify(resp, null, 2)
        }).catch((e) => {
          if (e === 'SQL Not Match') {
            this.testOutPut = this.$t('RuleEngine.resultIsEmpty')
          } else {
            this.testOutPut = this.$t('RuleEngine.checkForErrors')
          }
        })
      })
    },
    handlePreSQLTest() {
      this.record.ctx = {}
      const { test_columns: testColumn } = this.selectEvent
      if (this.showTest) {
        Object.entries(testColumn).forEach(([k, v]) => {
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
      this.selectEvent = this.events.find($ => $.event === val)
      this.record.field = '*'
      this.record.tiaojian = ''
    },
    topicSearch(queryString, cb) {
      clearTimeout(this.timer)
      if (!this.topics.length || !queryString) {
        return cb([])
      }
      this.timer = setTimeout(() => {
        const matchItems = this.topics.filter(
          $ => $.topic.includes(queryString), // || queryString.includes($.topic)
        ).sort(($1, $2) => ($1.toString().length > $2.toString().length ? -1 : 1))
        cb(matchItems)
      }, 300)
      return []
    },
    handleTopicSelect(item) {
      this.record.topic = item.topic
    },
  },
}
</script>


<style lang="scss">
@import './style.less';

.rule-create {
  @import './style.less';

  .available-fields {
    transition: all 0.3s;
    border-bottom: 1px dashed #d8d8d8;
    padding-bottom: 3px;
    position: relative;
    margin-right: 8px;
    user-select: none;
    cursor: pointer;

    &:hover {
      color: #34C388;
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
      color: #f5222d;
      margin-right: 4px;
    }
  }

  .tips-wrapper {
    width: 100% !important;
    word-break: break-word;
    padding: 6px 0 0 0;
  }

  .tips-form {
    padding-top: 4px;
  }
}
</style>
