<template>
  <div class="rule-create">

    <page-header>
      <div class="page-header-title-view">
        <div class="title">{{ $t('RuleEngine.createRules') }}</div>
      </div>

      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ $t('RuleEngine.definingRuleConditionsAndDataProcessing') }}
          </p>
        </div>
      </div>
    </page-header>

    <div class="emq-list-body rule-wrapper app-wrapper">
      <a-card class="emq-list-card">
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

              <el-form-item class="code-editor__item" prop="rawsql" :label="$t('RuleEngine.sqlInput')">
                <code-editor
                  v-model="record.rawsql"
                  class="sql"
                  lang="text/x-sql"
                ></code-editor>
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
                  <el-form-item
                    v-for="(field, i) in testField"
                    :key="i"
                    :prop="`ctx.${field}`"
                    :label="field"
                    :class="field === 'payload' ? 'code-editor__item' : ''"
                  >
                    <template v-if="field === 'payload'">
                      <code-editor
                        v-model="record.ctx[field]"
                        class="payload"
                        lang="application/json"
                        :lint="false"
                      ></code-editor>
                    </template>
                    <template v-else>
                      <el-input v-model="record.ctx[field]" :rows="5">
                      </el-input>
                    </template>
                  </el-form-item>

                  <el-form-item>
                    <span slot="label">&nbsp;</span>
                    <el-button type="primary" @click="handleSQLTest">
                      {{ $t('RuleEngine.sqlTest') }}
                    </el-button>
                  </el-form-item>

                  <el-form-item class="code-editor__item" :label="$t('RuleEngine.testOutput')">
                    <code-editor
                      v-model="testOutPut"
                      class="test-output"
                      height="250px"
                      lang="application/json"
                      :lint="false"
                      :disabled="true"
                    ></code-editor>
                  </el-form-item>

                </div>
              </el-collapse-transition>
            </el-form>
          </el-col>

          <el-col :span="9" class="tips-form">
            <div class="tips-item">
              <div style="color: #606266">
                {{ $t('RuleEngine.currentEventAvailableField') }}
                <transition name="el-fade-in-linear">
                  <span v-if="clipboardStatus" class="copy-success">{{ clipboardStatus }}</span>
                </transition>
              </div>
              <div class="tips-wrapper code">
                <span
                  v-for="key in availableFields"
                  :key="key"
                  v-clipboard:cpoy="key"
                  v-clipboard:success="copyAvailableFieldsSuccess"
                  class="available-fields"
                >
                  {{ key }}
                </span>
              </div>
            </div>

            <div class="tips-item">
              <div style="color: #606266">{{ $t('RuleEngine.exampleSql') }}</div>
              <div class="tips-wrapper code">
                <code>{{ selectEvent.sql_example }}</code>
              </div>
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
          <rule-actions ref="ruleAction" v-model="record.actions" :event="record.for">
          </rule-actions>
        </div>
      </a-card>

      <div class="button-group__center">
        <el-button type="default" size="medium" @click="$router.push({ path: '/rules' })">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" size="medium" @click="save">
          {{ $t('Base.create') }}
        </el-button>
      </div>

    </div>

  </div>
</template>


<script>
import {
  loadRuleEvents, SQLTest, createRule,
} from '@/api/rules'
import CodeEditor from '@/components/CodeEditor'
import { loadTopics } from '@/api/server'
import { sqlExampleFormatter } from '@/common/utils'
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleCrate',

  components: {
    RuleActions,
    CodeEditor,
  },

  props: {},

  data() {
    return {
      loadRuleEvents,
      topics: [],
      events: [],
      testOutPut: '',
      selectEvent: {
        columns: [
          'clientid',
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
          clientid: 'c_emqx',
          username: 'u_emqx',
          topic: 't/a',
          qos: 1,
          payload: '{"msg": "hello"}',
        },
        title: 'message publish',
      },
      timer: 0,
      showTest: false,
      clipboardContent: '',
      clipboardStatus: '',
      record: {
        for: '',
        rawsql: 'SELECT * FROM',
        actions: [],
        description: '',
        ctx: {},
      },
      rules: {
        for: { required: true, message: this.$t('RuleEngine.pleaseSelectTheTriggerEvent') },
        rawsql: { required: true, message: this.$t('RuleEngine.pleaseEnterTheSQL') },
      },
    }
  },

  computed: {
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
    this.handleForChange(this.record.for)
    const data = await loadTopics()
    this.topics = data.items || []
  },

  methods: {
    handleForChange(val) {
      this.selectEvent = this.events.find($ => $.event === val)
      const { sql_example } = this.selectEvent
      this.record.rawsql = sqlExampleFormatter(sql_example)
      this.handlePreSQLTest()
      const { ruleAction } = this.$refs
      if (ruleAction) {
        ruleAction.initData()
      }
    },
    handlePreSQLTest() {
      this.record.ctx = {}
      const { test_columns: testColumn } = this.selectEvent
      if (this.showTest) {
        Object.entries(testColumn).forEach(([k, v]) => {
          const key = k
          let value = v
          if (typeof v === 'object') {
            value = JSON.stringify(v)
          }
          this.$set(this.record.ctx, key, value)
        })
      }
    },
    handleSQLTest() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        const data = JSON.parse(JSON.stringify(this.record))
        this.testOutPut = ''

        if (data.ctx.payload) {
          try {
            data.ctx.payload = JSON.stringify(JSON.parse(data.ctx.payload))
          } catch (e) {
            console.error(e)
          }
        }

        SQLTest(data).then((res) => {
          this.testOutPut = JSON.stringify(res, null, 2)
        }).catch((error) => {
          if (error === 'SQL Not Match') {
            this.testOutPut = this.$t('RuleEngine.resultIsEmpty')
          } else {
            this.testOutPut = `${this.$t('RuleEngine.checkForErrors')}:\n\n${error}`
          }
        })
      })
    },
    copyAvailableFieldsSuccess() {
      this.clipboardStatus = this.$t('Base.copy')
      setTimeout(() => {
        this.clipboardStatus = ''
      }, 2000)
    },
    async save() {
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
        rawsql: this.record.rawsql,
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
  },
}
</script>


<style lang="scss">
.rule-create {
  @import './style.scss';

  .available-fields {
    transition: all 0.3s;
    border-bottom: 1px dashed #d8d8d8;
    padding-bottom: 3px;
    position: relative;
    margin-right: 8px;
    user-select: none;
    cursor: pointer;
    line-height: 2.3;

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

  .tips-form {
    .tips-item {
      margin-bottom: 20px;
      .notice {
        color: #f5222d;
      }

      .copy-success {
        color: #34C388;
        float: right;
      }
    }
  }

  .tips-wrapper {
    width: 100%;
    word-break: break-word;
    margin-top: 10px;
    background: #f6f7fb;
    border-radius: 4px;
    color: #909399;
    &.code {
      border: none;
      padding: 10px;
    }
  }
  .sql {
    .CodeMirror-scroll {
      min-height: 290px;
    }
  }
  .payload {
    .CodeMirror-scroll {
      min-height: 200px;
    }
  }
  .test-output {
    .CodeMirror-scroll {
      min-height: 250px;
    }
  }
}
</style>
