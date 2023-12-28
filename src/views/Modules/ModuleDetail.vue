<template>
  <div class="module-detail">
    <page-header>
      <div class="page-header-title-view">
        <div class="title">
          {{ moduleData.title[lang] }}
        </div>
      </div>
      <div class="page-header-content-view">
        <div class="content">
          <p class="description module-desc">
            {{ moduleData.description[lang] }}
          </p>
        </div>
      </div>

      <div class="page-header-top-start oper-button">
        <el-button type="info" size="small" @click="toReadMore(moduleData.type)">
          {{ $t('Modules.readMore') }}
        </el-button>
        <el-button type="danger" size="small" v-if="oper === 'edit'" :disabled="notAbleChange" @click="deleteModule">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </page-header>
    <div class="app-wrapper">
      <el-tabs class="module-detail-tabs" type="border-card" v-model="detailTabs">
        <!-- modules with more management tools-->
        <template v-if="oper == 'edit'">
          <template v-if="moduleData.type == 'mnesia_authentication'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.auth')" :name="specialModuleDefaultTabName">
              <mnesia-auth-table ref="auth" v-if="detailTabs === 'auth'"></mnesia-auth-table>
            </el-tab-pane>
            <el-tab-pane label="ACL" name="acl">
              <mnesia-acl-table ref="acl" v-if="detailTabs === 'acl'"></mnesia-acl-table>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'jwt_authentication'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.tabJwt')" :name="specialModuleDefaultTabName">
              <jwt-authentication v-if="detailTabs === 'jwt'"></jwt-authentication>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'auth_sasl'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.tabSasl')" :name="specialModuleDefaultTabName">
              <auth-sasl v-if="detailTabs === 'sasl'"></auth-sasl>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'lwm2m_protocol'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.tabLwm2m')" :name="specialModuleDefaultTabName">
              <lw-clients v-if="detailTabs === 'lwm2m'" :type="$route.query.type" :id="$route.query.imei"></lw-clients>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'topic_metrics'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.tabTopic')" :name="specialModuleDefaultTabName">
              <topic-metrics v-if="detailTabs === 'topic'"></topic-metrics>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'slow_subscribers_statistics'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.statistics')" :name="specialModuleDefaultTabName">
              <slow-query v-if="detailTabs === 'subscribers'"></slow-query>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'tracer'">
            <el-tab-pane ref="moduleSpecialTab" :label="$t('Modules.trace')" :name="specialModuleDefaultTabName">
              <log-trace v-if="detailTabs === 'trace'"></log-trace>
            </el-tab-pane>
          </template>
          <template v-else-if="moduleData.type == 'gcp_device'">
            <el-tab-pane
              ref="moduleSpecialTab"
              :label="$t('Modules.deviceManagement')"
              :name="specialModuleDefaultTabName"
            >
              <GCPIoT v-if="detailTabs === 'devices'" />
            </el-tab-pane>
          </template>
        </template>
        <el-tab-pane :label="$t('Modules.configuration')" name="configuration">
          <!-- <div class="emq-title module-title">
            {{ $t('Modules.configuration') }}
          </div> -->
          <el-form ref="record" :model="record" :rules="rules" label-position="top" size="small">
            <el-row class="config-item-wrapper" :gutter="30">
              <template v-if="configList.length > 0">
                <div v-for="(item, i) in configList" :key="i">
                  <template v-if="item.key !== 'listener'">
                    <el-col :span="getParamItemSpan(item)">
                      <el-form-item
                        v-if="item.elType !== 'file' && !['verify', 'tls_version'].includes(item.key)"
                        v-bind="item.formItemAttributes"
                      >
                        <template v-if="item.formItemAttributes.description" slot="label">
                          {{ item.formItemAttributes.label }}
                          <el-popover width="220" trigger="hover" placement="top">
                            <div class="emq-popover-content" v-html="item.formItemAttributes.description"></div>
                            <i slot="reference" class="el-icon-question"></i>
                          </el-popover>
                        </template>
                        <template v-if="item.elType === 'object'">
                          <key-and-value-editor v-model="record.config[item.key]"></key-and-value-editor>
                        </template>
                        <template v-else-if="item.elType === 'array'">
                          <array-editor
                            ref="arrayEditor"
                            v-model="record.config[item.key]"
                            :data="item.oneObjOfArray"
                            :isDadRequired="rules.config[item.key].length > 0"
                          ></array-editor>
                        </template>
                        <template v-else-if="item.elType === 'cfgselect'">
                          <config-select
                            v-model="record.config[item.key]"
                            v-bind="item.bindAttributes"
                            class="reset-width"
                            :extraConfigs="item.extraConfigs"
                            @updateConfig="addConfigAccordingType"
                          >
                          </config-select>
                        </template>
                        <!-- TLS Version -->
                        <TLSVersionSelect v-else-if="judgeIsTLSVersion(item)" v-model="record.config[item.key]" />
                        <binary-file-editor
                          v-else-if="item.elType === 'binary_file'"
                          v-model="record.config[item.key]"
                        ></binary-file-editor>
                        <!-- input -->
                        <template v-else-if="item.elType !== 'select'">
                          <el-input
                            v-if="item.type === 'number' || item.type === 'integer'"
                            v-model.number="record.config[item.key]"
                            v-bind="item.bindAttributes"
                          >
                          </el-input>

                          <el-input
                            v-else-if="item.type === 'password'"
                            v-model="record.config[item.key]"
                            v-bind="item.bindAttributes"
                            autocomplete="new-password"
                            show-password
                          >
                          </el-input>

                          <el-input v-else v-model="record.config[item.key]" v-bind="item.bindAttributes"> </el-input>
                        </template>

                        <!-- select -->
                        <template v-else>
                          <emq-select
                            v-if="item.type === 'number' || item.type === 'integer'"
                            v-model.number="record.config[item.key]"
                            v-bind="item.bindAttributes"
                            class="reset-width"
                          >
                          </emq-select>

                          <emq-select
                            v-else
                            v-model="record.config[item.key]"
                            v-bind="item.bindAttributes"
                            class="reset-width"
                          >
                          </emq-select>
                        </template>
                      </el-form-item>
                      <template v-else>
                        <el-form-item
                          v-if="
                            ['true', true].includes(record.config['https_enabled']) ||
                            ['true', true].includes(record.config['ssl']) ||
                            (record.config['ssl'] === undefined && record.config['https_enabled'] === undefined)
                          "
                          v-bind="item.formItemAttributes"
                        >
                          <file-editor v-if="item.elType === 'file'" v-model="record.config[item.key]"></file-editor>
                          <emq-select
                            v-else
                            v-model="record.config[item.key]"
                            v-bind="item.bindAttributes"
                            class="reset-width"
                          >
                          </emq-select>
                        </el-form-item>
                      </template>
                    </el-col>
                  </template>
                </div>
              </template>
              <template v-else-if="!configList.length">
                <div class="no-config">
                  <i class="el-icon-warning"></i>
                  <span>{{ $t('Modules.noConfig') }}</span>
                  <span v-if="oper === 'add'">{{ $t('Modules.noConfigAdd') }}</span>
                </div>
              </template>
              <div v-else class="params-loading-wrapper">
                <a-skeleton active></a-skeleton>
              </div>
            </el-row>
          </el-form>
          <div v-if="Object.keys(listener).length" class="listener-wrapper">
            <div class="emq-title listener-title">
              {{ $t('Modules.listener') }}
            </div>
            <Listeners v-model="record.config['listeners']" :listenerData="listener"> </Listeners>
          </div>

          <div class="button-group__center" v-if="configList.length || oper === 'add'">
            <el-button size="small" @click="exitDetail(true)">{{ $t('Base.cancel') }}</el-button>
            <el-button
              :loading="buttonLoading"
              class="dialog-primary-btn"
              type="primary"
              size="small"
              :disabled="notAbleChange"
              @click="handleCreate()"
            >
              <span v-if="oper === 'add'">{{ $t('Base.add') }}</span>
              <span v-else>{{ $t('Base.confirm') }}</span>
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { createModule, loadAllModules, updateModule, destroyModule } from '@/api/modules'
import { renderParamsForm, fillI18n, judgeIsTLSVersion } from '@/common/utils'
import {
  findCurrentExtraConfigParams,
  deleteParamsByKeys,
  findCurrentExtraRules,
  deleteRulesByKeys,
  getOtherExtraConfigs,
  diffConfigList,
} from '@/common/someUtilsForCfgselect'
import {
  getParamItemSpan,
  isParamSSLType,
  isParamBoolType,
  findParamItemByKey,
} from '@/common/someUtilsForSchemaForm.js'
import handleMongoDBSRV from '@/mixins/handleMongoDBSRV'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import ArrayEditor from '@/components/ArrayEditor'
import FileEditor from '@/components/FileEditor'
import ConfigSelect from '@/components/ConfigSelect'
import MnesiaAuthTable from './components/AuthMnesia/MnesiaAuthTable'
import MnesiaAclTable from './components/AuthMnesia/MnesiaAclTable'
import JwtAuthentication from './components/JwtAuthentication/JwtAuthentication'
import AuthSasl from './components/AuthSasl/AuthSasl'
import LwClients from './components/Lwm2mProtocol/LwClients'
import TopicMetrics from './components/TopicMetrics/TopicMetrics'
import SlowQuery from './components/SlowQuery/SlowQuery.vue'
import GCPIoT from './components/GCPIoT/GCPIoT.vue'
import TLSVersionSelect from '@/components/TLSVersionSelect.vue'
import BinaryFileEditor from '@/components/BinaryFileEditor.vue'

import LogTrace from './components/LogTrace/LogTrace'
import Listeners from './components/Listeners'

export default {
  name: 'ModuleDetail',

  components: {
    KeyAndValueEditor,
    ArrayEditor,
    Listeners,
    FileEditor,
    ConfigSelect,
    MnesiaAuthTable,
    MnesiaAclTable,
    JwtAuthentication,
    AuthSasl,
    LwClients,
    TopicMetrics,
    SlowQuery,
    LogTrace,
    TLSVersionSelect,
    GCPIoT,
    BinaryFileEditor,
  },

  mixins: [handleMongoDBSRV('module')],

  inheritAttrs: false,

  data() {
    return {
      configLoading: false,
      configList: [],
      record: {
        config: {},
      },
      rules: {
        config: {},
      },
      allModuleList: [],
      listener: {},
      fullSpanType: ['array', 'object', 'textarea'],
      originConfigList: [],
      originRules: {
        config: {},
      },
      originRecord: {
        config: {},
      },
      buttonLoading: false,
      detailTabs: 'configuration',
      specialModuleDefaultTabMap: {
        mnesia_authentication: 'auth',
        jwt_authentication: 'jwt',
        auth_sasl: 'sasl',
        lwm2m_protocol: 'lwm2m',
        topic_metrics: 'topic',
        slow_subscribers_statistics: 'subscribers',
        tracer: 'trace',
        gcp_device: 'devices',
      },
      // canManageModuleTypes: [
      //   'mnesia_authentication',
      //   'jwt_authentication',
      //   'auth_sasl',
      //   'lwm2m_protocol',
      //   'topic_metrics',
      // ],
    }
  },

  computed: {
    oper() {
      return this.$store.state.selectedModule.oper
    },
    moduleData() {
      return this.$store.state.selectedModule
    },
    from() {
      return this.$store.state.selectedModule.from
    },
    lang() {
      return this.$store.state.lang
    },
    recordConfig() {
      return this.record.config
    },
    listeners() {
      return this.record.config.listeners
    },
    rsSetName() {
      return this.record && this.record.config && this.record.config.rs_set_name
    },
    specialModuleDefaultTabName() {
      return this.specialModuleDefaultTabMap[this.moduleData.type]
    },
  },

  watch: {
    listeners: {
      deep: true,
      immediate: true,
      handler: 'handlelistenersChange',
    },
    /**
     * Because the rsSetName field is not present when the form is initialized,
     * it needs to be monitored and set its rules when it appears.
     */
    rsSetName() {
      this.setRsSetNameFieldRequired()
    },
  },

  created() {
    this.loadData()
    this.initListeners()
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  },
  mounted() {
    if (this.$route.query.type === 'lwm2m' && this.$route.query.imei) {
      this.detailTabs = 'lwm2m'
    }
    this.setInitActiveTab()
  },

  methods: {
    isParamBoolType,
    getParamItemSpan,
    deleteParamsByKeys,
    deleteRulesByKeys,
    getOtherExtraConfigs,
    diffConfigList,
    judgeIsTLSVersion(item) {
      return judgeIsTLSVersion(item)
    },
    handlelistenersChange(val) {
      this.originRecord.config.listeners = _.cloneDeep(val)
    },
    loadData() {
      if (this.oper === 'add') {
        this.loadConfigList(this.moduleData.paramsData)
      } else {
        this.loadParams()
          .then((res) => {
            this.loadConfigList(res)
          })
          .catch()
      }
    },
    // cleanForm() {
    //   if (this.$refs.record) {
    //     setTimeout(() => {
    //       this.$refs.record.resetFields()
    //       this.configList = []
    //     }, 10)
    //   }
    // },
    /**
     * for module rewrite
     */
    addRuleForValidateDestTopic() {
      const _this = this
      const targetArrayField = this.configList.find(({ key }) => key === 'rules')
      const targetRule =
        targetArrayField &&
        targetArrayField.oneObjOfArray &&
        targetArrayField.oneObjOfArray.rules &&
        targetArrayField.oneObjOfArray.rules.dest
      if (targetRule) {
        // TODO:add rule for rewrite
        targetArrayField.oneObjOfArray.rules.dest.push({
          validator: (rule, value, callback) => {
            this.$nextTick(() => {
              const indexReg = /\.(\d+)\./
              const fieldPath = rule.field
              if (!fieldPath) {
                callback()
                return
              }
              const targetIndex = fieldPath.match(indexReg) ? Number(fieldPath.match(indexReg)[1]) : undefined
              const rewriteType = _this.record.config.rules[targetIndex] && _this.record.config.rules[targetIndex].type
              if (!rewriteType) {
                callback()
                return
              }
              const wildcardReg = /(^(#|\+)$)|(\/(#|\+)\/)|(\/(#|\+)$)|(^(\+|#)\/)/
              if (rewriteType === 'publish' && wildcardReg.test(value)) {
                callback(_this.$t('Modules.topicCannotContain'))
              } else {
                callback()
              }
            })
          },
        })
      }
    },
    loadConfigList(params) {
      const { listener, ...paramsData } = params
      if (listener) {
        this.listener = listener
      }
      this.configLoading = true
      const configData = renderParamsForm(paramsData, 'config')
      const { form, rules } = configData
      this.configList = form
      if (this.moduleData.type === 'topic_rewrite') {
        this.addRuleForValidateDestTopic()
      }
      this.rules.config = rules
      this.record.config = {}
      form.forEach(({ key, value }) => {
        this.$set(this.record.config, key, value)
      })
      this.initListeners()
      this.storeOriginData(configData)
      this.configLoading = false
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
    cleanFileContent(config) {
      const falseValues = [false, 'false']
      if (falseValues.includes(config.ssl) || falseValues.includes(config.https_enabled)) {
        config.verify = false
        Object.keys(config).forEach((key) => {
          const oneValue = config[key]
          const paramItem = this.findParamItemByKey(key)
          if (typeof oneValue === 'object' && Object.keys(oneValue).includes('file') && isParamSSLType(paramItem)) {
            config[key] = {
              file: '',
              filename: '',
            }
          }
        })
      }
    },
    async validateArrayEditor() {
      return new Promise((resolve, reject) => {
        const { arrayEditor } = this.$refs
        if (arrayEditor && arrayEditor[0] && arrayEditor[0].validateForm && _.isFunction(arrayEditor[0].validateForm)) {
          arrayEditor[0].validateForm()
          if (arrayEditor[0]._data.innerValid === false) {
            reject()
          }
        }
        resolve()
      })
    },
    findParamItemByKey(keyForFind) {
      return findParamItemByKey(this.configList, keyForFind)
    },
    async handleCreate() {
      try {
        await this.$refs.record.validate()
        await this.validateArrayEditor()
      } catch (error) {
        return
      }

      if (Object.keys(this.listener).length && !this.record.config.listeners.length) {
        this.$message.error(this.$t('Modules.emptyListenerTip'))
        return
      }
      const { config } = this.record
      // String to Boolean
      Object.keys(config).forEach((label) => {
        const param = this.findParamItemByKey(label)
        const isBoolType = this.isParamBoolType(param)
        if (!isBoolType) {
          return
        }

        const value = config[label]
        if (value === 'true') {
          this.record.config[label] = true
        }
        if (value === 'false') {
          this.record.config[label] = false
        }
      })

      this.cleanFileContent(config)
      if (this.oper === 'add') {
        try {
          this.buttonLoading = true
          this.record.type = this.moduleData.type
          const data = await createModule(this.record)
          const addedModules = JSON.parse(localStorage.getItem('addedModules')) || {}
          addedModules[data.type] = data.id
          localStorage.setItem('addedModules', JSON.stringify(addedModules))
          this.$message.success(this.$t('Modules.moduleAddSuccess'))
          this.exitDetail()
        } catch (error) {
          //
        } finally {
          this.buttonLoading = false
        }
      } else {
        const isEdited = !_.isEqual(this.record.config, this.originRecord.config)
        if (isEdited) {
          this.$confirm(this.$t('Modules.editTip'), {
            type: 'warning',
            cancelButtonText: this.$t('Base.cancel'),
            confirmButtonText: this.$t('Modules.continueCommit'),
          })
            .then(() => {
              this.confirmEditModule()
            })
            .catch(() => {})
        } else {
          this.exitDetail()
        }
      }
    },
    async confirmEditModule() {
      const { type, id, enabled, description } = this.moduleData
      const data = {
        type,
        id,
        enabled,
        description,
        config: this.record.config,
      }
      await updateModule(id, data)
      this.$message.success(this.$t('Modules.moduleEditSuccess'))
      this.exitDetail()
    },
    parseI18n(val) {
      const data = fillI18n(val, ['title', 'description']).map((item) => {
        item.params = fillI18n(item.params, true)
        return item
      })
      return data
    },
    async loadParams() {
      // 拿到当前编辑的模块的params
      const allFeatures = await loadAllModules()
      Object.values(allFeatures).forEach((item) => {
        this.allModuleList = this.allModuleList.concat(item)
      })
      const currentModule = this.allModuleList.find((item) => item.name === this.moduleData.type)
      this.parseI18n([currentModule])
      const { params } = currentModule

      // 赋值
      Object.keys(params).forEach((item) => {
        if (this.moduleData.config[item] !== undefined) {
          params[item].default = this.moduleData.config[item]
        }
      })
      return params
    },
    deleteModule() {
      this.$msgbox
        .confirm(this.$t('Modules.thisActionWillDeleteTheModule'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyModule(this.moduleData.id)
          this.$message.success(this.$t('Base.deleteSuccess'))
          const addedModules = JSON.parse(localStorage.getItem('addedModules')) || {}
          delete addedModules[this.moduleData.type]
          localStorage.setItem('addedModules', JSON.stringify(addedModules))
          this.exitDetail()
        })
        .catch(() => {})
    },
    exitDetail(isCancel = false) {
      // this.cleanForm()
      setTimeout(() => {
        if (this.$route.query.backTo) {
          this.$router.push({ name: this.$route.query.backTo })
          return
        }
        if (this.from === 'modules' || !isCancel) {
          this.$router.push('/modules')
        } else {
          this.$router.push({
            name: 'modules-select',
            query: {
              id: this.$route.query.id,
              top: this.$route.query.top,
            },
          })
        }
      }, 10)
    },
    initListeners() {
      if (Object.keys(this.listener).length) {
        if (this.oper === 'add') {
          this.record.config.listeners = []
        } else {
          const { listeners } = this.moduleData.config
          this.record.config.listeners = listeners || []
        }
      }
      this.originRecord.config.listeners = _.cloneDeep(this.record.config.listeners)
    },
    storeOriginData(configData) {
      const { form, rules } = configData
      this.originConfigList = form
      this.originRules.config = rules
      this.originRecord.config = {}
      form.forEach(({ key, value }) => {
        this.$set(this.originRecord.config, key, value)
      })
    },
    findCurrentExtraConfigParams() {
      return findCurrentExtraConfigParams(this.originConfigList, this.configList)
    },
    findCurrentExtraRules() {
      return findCurrentExtraRules(this.originRules.config, this.rules.config)
    },
    addConfigAccordingType(extraConfigs, type, totalExtraConfigs, isInit = false) {
      // unneeded configuration items
      const [...commonConfig] = this.originConfigList
      const { ...rulesCommonConfig } = this.originRules.config
      const { ...recordCommonConfig } = this.originRecord.config

      const otherExtraConfigs = this.getOtherExtraConfigs(totalExtraConfigs, type)
      const { needAdded: needAddedConfigs } = this.diffConfigList(this.configList, commonConfig)

      const extraParamsNeeds = this.deleteParamsByKeys(
        this.findCurrentExtraConfigParams(),
        Object.keys(otherExtraConfigs),
      )
      const extraRulesNeeds = this.deleteRulesByKeys(this.findCurrentExtraRules(), Object.keys(otherExtraConfigs))
      const record = {
        ..._.omit(this.record.config, Object.keys(otherExtraConfigs)),
        ..._.pick(recordCommonConfig, needAddedConfigs),
      }

      if (extraConfigs && typeof extraConfigs === 'object' && Object.keys(extraConfigs).length) {
        const configData = renderParamsForm(extraConfigs, 'config')
        const { form, rules } = configData
        const addConfigs = {}
        if (isInit && this.oper === 'edit') {
          form.forEach(({ key }) => {
            this.$set(addConfigs, key, this.record.config[key])
          })
        } else {
          form.forEach(({ key, value }) => {
            this.$set(addConfigs, key, value)
          })
        }
        this.configList = commonConfig.concat(form, extraParamsNeeds)
        this.rules.config = Object.assign(rulesCommonConfig, rules, extraRulesNeeds)
        this.record.config = Object.assign(record, addConfigs)
      } else {
        this.configList = commonConfig.concat(extraParamsNeeds)
        this.rules.config = rulesCommonConfig
        this.record.config = record
      }
      this.configList.sort((prev, next) => prev.order - next.order)
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
    toReadMore(type) {
      const langUrl = this.lang === 'zh' ? 'cn/cn/' : 'io/en/'
      const url = `https://docs.emqx.${langUrl}enterprise/${process.env.VUE_APP_VERSION}/modules/${type}.html`
      const windowUrl = window.open(url)
      windowUrl.opener = null
    },
    setInitActiveTab() {
      if (this.oper === 'edit' && this.specialModuleDefaultTabName && this.$refs.moduleSpecialTab) {
        this.detailTabs = this.specialModuleDefaultTabName
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.module-detail {
  .page-header-content {
    padding: 16px 20px;
  }
  .oper-button {
    top: calc(50% - 14px);
  }

  .module-detail-tabs {
    ::v-deep .el-tabs__nav {
      display: flex;
    }
  }

  .module-title {
    margin-bottom: 10px;
  }

  .listener-title {
    margin-bottom: 20px;

    &::before {
      content: '*';
      color: #f5222d;
      font-size: 12px;
      vertical-align: text-bottom;
    }
  }
  .module-desc {
    max-width: 700px;
  }

  .el-form {
    padding: 10px;
  }
  .el-form-item {
    .el-form-item__label {
      font-size: 14px;
      color: #606266;
    }
  }

  .config-item-wrapper {
    min-height: 100px;

    .params-loading-wrapper {
      padding: 0 32px;
    }
  }

  .button-group__center {
    margin: 20px 0;
  }

  .listener-wrapper {
    margin-top: 24px;
  }

  .delete-btn {
    top: 50%;
    transform: translateY(-50%);
  }

  .no-config {
    min-height: 100px;
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 100px;

    i {
      margin-right: 5px;
    }
  }
}
</style>
