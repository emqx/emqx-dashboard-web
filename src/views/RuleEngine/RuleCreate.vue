<template>
  <div class="rule-create">
    <page-header>
      <div class="page-header-title-view">
        <div class="title">{{ isEdit ? $t('RuleEngine.editRules') : $t('RuleEngine.createRules') }}</div>
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
              <el-form-item class="code-editor__item" prop="rawsql" :label="$t('RuleEngine.sqlInput')">
                <div class="monaco-container monaco-sql" :style="{ height: `${sqlEditorHeight}px` }">
                  <monaco
                    id="rule-sql"
                    v-model="record.rawsql"
                    class="sql"
                    warp
                    lang="sql"
                    :provider="sqlProvider"
                    @qucik-save="handleSQLTest"
                  ></monaco>
                </div>
                <!-- <stretch-height v-model="sqlEditorHeight"></stretch-height> -->
              </el-form-item>

              <el-form-item prop="id" :label="$t('RuleEngine.ruleID')">
                <el-input v-model="record.id" :disabled="isEdit"></el-input>
              </el-form-item>

              <el-form-item prop="description" :label="$t('RuleEngine.resourceDes')">
                <el-input v-model="record.description"></el-input>
              </el-form-item>

              <el-form-item :label="$t('RuleEngine.sqlTest')">
                <el-switch v-model="showTest" @change="initTestFormItem"></el-switch>
                <el-popover width="220" placement="right" trigger="hover">
                  {{ $t('RuleEngine.inputMetadata') }}
                  <i slot="reference" class="icon el-icon-question"></i>
                </el-popover>
              </el-form-item>

              <el-collapse-transition>
                <div v-if="showTest">
                  <el-form-item
                    v-for="k in Object.keys(selectEvent.test_columns)"
                    :key="k"
                    :class="{ 'code-sql': k === 'payload', payload: k === 'payload' }"
                    v-bind="{ label: k, prop: `ctx.${k}` }"
                  >
                    <el-input v-if="k !== 'payload'" v-model="record.ctx[k]"> </el-input>
                    <template v-else>
                      <div class="monaco-container monaco-payload" :style="{ height: `${payloadEditorHeight}px` }">
                        <monaco
                          id="payload"
                          v-model="record.ctx.payload"
                          class="payload"
                          :lang="payloadType"
                          @qucik-save="handleSQLTest"
                        ></monaco>
                      </div>
                      <div class="payload-type">
                        <el-radio-group v-model="payloadType">
                          <el-radio label="json">JSON</el-radio>
                          <el-radio label="plaintext">Plaintext</el-radio>
                        </el-radio-group>
                      </div>
                      <stretch-height v-model="payloadEditorHeight" class="payload"> </stretch-height>
                    </template>
                  </el-form-item>

                  <el-form-item>
                    <span slot="label">&nbsp;</span>
                    <el-button type="primary" @click="handleSQLTest">
                      {{ $t('RuleEngine.sqlTest') }}
                    </el-button>
                  </el-form-item>

                  <el-form-item class="code-editor__item" :label="$t('RuleEngine.testOutput')">
                    <div class="monaco-container monaco-test-output" style="height: 200px">
                      <monaco
                        id="testOutput"
                        v-model="testOutPut"
                        class="test-output"
                        lang="json"
                        :disabled="true"
                      ></monaco>
                    </div>
                  </el-form-item>
                </div>
              </el-collapse-transition>
            </el-form>
          </el-col>

          <el-col :span="9" class="tips-form">
            <div class="tips-item" v-html="$t('RuleEngine.sql_tips')"></div>
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
          <rule-actions ref="ruleAction" v-model="record.actions"> </rule-actions>
        </div>
      </a-card>
    </div>

    <div
      class="button-group__center rule-create-operation"
      :style="{ width: $store.state.leftBarCollapse ? ' calc(100% - 80px)' : ' calc(100% - 200px)' }"
    >
      <el-button type="default" size="medium" @click="$router.push({ path: '/rules' })">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button type="primary" size="medium" @click="save">
        {{ isEdit ? $t('Base.confirm') : $t('Base.create') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { loadRuleEvents, SQLTest, createRule, loadRuleDetails, updateRule } from '@/api/rules'
import { loadTopics } from '@/api/server'
import { sqlExampleFormatter, ruleNewSqlParser, ruleOldSqlCheck, verifyID } from '@/common/utils'
import Monaco from '@/components/Monaco'
import StretchHeight from '@/components/StretchHeight'
import { ruleEngineProvider } from '@/common/provider'
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleCrate',

  components: {
    RuleActions,
    Monaco,
    StretchHeight,
  },

  props: {},

  data() {
    return {
      loadRuleEvents,
      isEdit: false,
      needCheckSql: true,
      sqlEditorHeight: 320,
      payloadEditorHeight: 200,
      payloadType: 'json',
      topics: [],
      events: [],
      testOutPut: '',
      selectEvent: {
        columns: ['clientid', 'username', 'event', 'id', 'payload', 'peername', 'qos', 'timestamp', 'topic', 'node'],
        description: '$events/message_publish',
        event: '$events/message_publish',
        // sql_example: 'SELECT * FROM "t/#"',
        test_columns: {
          clientid: 'c_emqx',
          username: 'u_emqx',
          topic: 't/a',
          qos: 1,
          payload: '{"msg": "hello"}',
        },
        title: '$events/message_publish',
      },
      timer: 0,
      showTest: false,
      clipboardContent: '',
      clipboardStatus: '',
      record: {
        rawsql: 'SELECT * FROM',
        actions: [],
        description: '',
        ctx: {},
        id: `rule:${Math.random().toString().slice(3, 9)}`,
      },
      rules: {
        rawsql: { required: true, message: this.$t('RuleEngine.pleaseEnterTheSQL') },
        id: { required: true, validator: verifyID },
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
    sqlProvider() {
      return ruleEngineProvider
    },
    currentRule() {
      return this.$route.query.rule
    },
  },

  watch: {
    'record.rawsql': 'handleSqlChanged',
  },

  async created() {
    this.events = await loadRuleEvents()
    this.selectEvent = this.events[0]
    const data = await loadTopics()
    this.topics = data.items || []
    if (this.currentRule) {
      this.isEdit = true
      this.loadRule()
    } else {
      this.initData('$events/message_publish')
    }
  },

  methods: {
    initData(eventName) {
      this.selectEvent = this.events.find(($) => $.event === eventName)
      const { sql_example } = this.selectEvent
      this.record.rawsql = sqlExampleFormatter(sql_example)
      this.initTestFormItem()
      const { ruleAction } = this.$refs
      if (ruleAction) {
        ruleAction.initData()
      }
    },
    handleSqlChanged(val) {
      this.triggerEventChange(val)
      if (!this.needCheckSql) {
        return
      }
      const checkValues = ruleOldSqlCheck(val)
      if (!checkValues) {
        return
      }
      this.sqlParse(val, checkValues[0])
    },
    sqlParse(sql, oldEvent) {
      this.$confirm(this.$t('RuleEngine.parse_confirm'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(() => {
          this.record.rawsql = sqlExampleFormatter(ruleNewSqlParser(sql, oldEvent))
        })
        .catch(() => {
          this.needCheckSql = false
        })
    },
    triggerEventChange(sql) {
      const events = [
        'events/message_delivered',
        'events/message_acked',
        'events/message_dropped',
        'events/client_connected',
        'events/client_disconnected',
        'events/session_subscribed',
        'events/session_unsubscribed',
        'events/delivery_dropped',
      ]
      let values = null
      let value = ''
      events.forEach((e) => {
        const [regType, regEvent] = e.split('/')
        const reg = new RegExp(`\\$${regType}\\/${regEvent}`, 'gim')
        if (sql.match(reg)) {
          values = sql.match(reg)
        }
      })
      if (values) {
        value = values[0]
      } else {
        value = '$events/message_publish'
      }
      if (value === this.selectEvent.event) {
        return
      }
      this.selectEvent = this.events.find(($) => $.event === value) || { columns: {}, test_columns: {} }
      this.sqlPrimaryKey = this.events.columns
      this.initTestFormItem()
    },
    initTestFormItem() {
      this.testOutPut = ''
      const testFieldObject = {}

      const { test_columns: testColumns } = this.selectEvent
      Object.keys(testColumns).forEach((k) => {
        let value = testColumns[k]

        if (typeof value === 'object') {
          value = JSON.stringify(value, null, 2)
        }
        testFieldObject[k] = value
      })
      this.$set(this.record, 'ctx', testFieldObject)
    },
    beforeSqlValid(sql) {
      const checkValues = ruleOldSqlCheck(sql)
      if (!checkValues) {
        return true
      }
      this.sqlParse(sql, checkValues[0])
      return false
    },
    handleSQLTest() {
      this.needCheckSql = true
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          if (this.showTest && !this.record.id) {
            this.$refs.record.clearValidate('id')
          } else {
            return
          }
        }
        if (!this.beforeSqlValid(this.record.rawsql)) {
          return
        }
        const data = JSON.parse(JSON.stringify(this.record))
        this.testOutPut = ''

        if (data.ctx.payload) {
          try {
            data.ctx.payload = JSON.stringify(JSON.parse(data.ctx.payload))
          } catch (e) {
            console.log(e)
          }
        }

        SQLTest(data)
          .then((res) => {
            this.testOutPut = JSON.stringify(res, null, 2)
          })
          .catch((error) => {
            if (error === 'SQL Not Match') {
              this.testOutPut = this.$t('RuleEngine.resultIsEmpty')
            } else {
              this.testOutPut = `${this.$t('RuleEngine.checkForErrors')}:\n\n${error}`
            }
          })
      })
    },
    // copyAvailableFieldsSuccess() {
    //   this.clipboardStatus = this.$t('Base.copied')
    //   setTimeout(() => {
    //     this.clipboardStatus = ''
    //   }, 2000)
    // },
    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      if (this.record.actions.length === 0) {
        this.$message.error(this.$t('RuleEngine.pleaseAddAResponseAction'))
        return
      }
      const { rawsql, actions, description, id } = this.record
      const data = {
        rawsql,
        actions,
        description,
        id,
      }
      if (this.isEdit && this.currentRule) {
        updateRule(this.currentRule, data).then(() => {
          this.$message.success(this.$t('Base.editSuccess'))
          setTimeout(() => {
            this.$router.push({ path: '/rules' })
          }, 600)
        })
      } else {
        createRule(data).then(() => {
          this.$message.success(this.$t('Base.createSuccess'))
          setTimeout(() => {
            this.$router.push({ path: '/rules' })
          }, 600)
        })
      }
    },
    async loadRule() {
      const rule = await loadRuleDetails(this.currentRule)
      this.record = rule
      setTimeout(() => {
        this.$refs.ruleAction.loadActions()
      }, 500)
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
      color: #34c388;
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
    position: relative;
    &::before {
      content: '*';
      color: #f5222d;
      font-size: 12px;
      position: absolute;
      left: -10px;
      top: 3px;
    }
  }

  .tips-form {
    p {
      margin: 10px 0;
    }
    .tips-item {
      padding: 5px;
      background: #f6f7fb;
      code {
        padding: 5px;
        background-color: #e6e6e6;
        display: block;
      }
    }
  }

  .payload.stretch-height {
    .el-icon-more {
      top: -11px;
    }
  }

  .payload-type {
    width: 100%;
    padding: 2px 12px;
    background: #f6f7fb;
    border: 1px solid #d9d9d9;
    border-top: none;
    text-align: right;
    .el-radio__label {
      font-size: 13px;
    }
  }

  .rule-create-operation {
    position: fixed;
    bottom: 0;
    background: #fff;
    padding: 12px 0;
    box-shadow: 0 -2px 2px 2px #eaeaea;
    transition: all 0.3s;
  }
}
</style>
