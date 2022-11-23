<template>
  <el-dialog
    :title="oper === 'edit' ? $t('RuleEngine.editResources') : $t('RuleEngine.createResources')"
    class="resource-dialog"
    width="520px"
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    v-on="$listeners"
    @open="loadData"
    @close="clearForm"
  >
    <el-form ref="record" :model="record" :rules="rules" label-position="top" size="small">
      <el-form-item prop="type" :label="$t('RuleEngine.resourceTypes')">
        <emq-select
          v-model="record.type"
          filterable
          :disabled="disabledSelect"
          :field-name="{ label: 'title', value: 'name' }"
          :field="{ options: availableTypes }"
          @change="resourceTypeChange"
        >
        </emq-select>
        <el-button
          :loading="loadingButton === 'testButton'"
          :disabled="!record.type"
          type="primary"
          style="margin-left: 20px"
          @click="handleCreate(true)"
        >
          {{ $t('RuleEngine.testConnection') }}
        </el-button>
      </el-form-item>

      <el-row v-if="record.type" class="config-item-wrapper" :gutter="20">
        <el-col :span="12">
          <el-form-item prop="id" :label="$t('RuleEngine.resourceID')">
            <el-input v-model="record.id" :disabled="oper === 'edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="description" :label="$t('RuleEngine.resourceDes')">
            <el-input v-model="record.description" :placeholder="$t('RuleEngine.pleaseEnter')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="line"></div>
        </el-col>
        <div v-if="configLoading" class="params-loading-wrapper">
          <a-skeleton active></a-skeleton>
        </div>
        <template v-else-if="configList.length > 0">
          <el-col v-for="(item, i) in configList" :key="i" :span="getParamItemSpan(item)">
            <el-form-item v-if="!isParamSSLType(item)" v-bind="item.formItemAttributes">
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
              <!-- config select -->
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
              <!-- file -->
              <file-editor v-else-if="item.elType === 'file'" v-model="record.config[item.key]"></file-editor>
              <binary-file-editor
                v-else-if="item.elType === 'binary_file'"
                v-model="record.config[item.key]"
              ></binary-file-editor>
              <!-- input -->
              <template v-else-if="item.elType !== 'select'">
                <el-input
                  v-if="item.type === 'number'"
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
                  v-if="item.type === 'number'"
                  v-model.number="record.config[item.key]"
                  v-bind="item.bindAttributes"
                  class="reset-width"
                >
                </emq-select>

                <emq-select v-else v-model="record.config[item.key]" v-bind="item.bindAttributes" class="reset-width">
                </emq-select>
              </template>
            </el-form-item>
            <template v-else>
              <el-form-item v-if="showSSLField(item.key)" v-bind="item.formItemAttributes">
                <file-editor
                  v-if="item.elType === 'file'"
                  v-model="record.config[item.key]"
                  :accept="fileEditorAccept(item)"
                ></file-editor>
                <emq-select v-else v-model="record.config[item.key]" v-bind="item.bindAttributes" class="reset-width">
                </emq-select>
              </el-form-item>
            </template>
          </el-col>
        </template>
      </el-row>
      <a-skeleton v-else-if="oper === 'edit' && (!record.type || resourceTypes.length < 1)" active></a-skeleton>
    </el-form>

    <div slot="footer" class="dialog-align-footer">
      <el-button size="small" @click="handleCache">{{ $t('Base.cancel') }}</el-button>
      <el-button
        :loading="loadingButton === 'createButton'"
        class="dialog-primary-btn"
        type="primary"
        size="small"
        @click="handleCreate(false)"
      >
        {{ $t('Base.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import { loadResourceTypes, createResource, editResource } from '@/api/rules'
import handleMongoDBSRV from '@/mixins/handleMongoDBSRV'
import { renderParamsForm, verifyID } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import FileEditor from '@/components/FileEditor'
import ConfigSelect from '@/components/ConfigSelect'
import {
  findCurrentExtraConfigParams,
  deleteParamsByKeys,
  findCurrentExtraRules,
  deleteRulesByKeys,
  getOtherExtraConfigs,
  diffConfigList,
} from '@/common/someUtilsForCfgselect'
import { isParamBoolType, isParamSSLType, findParamItemByKey, getParamItemSpan } from '@/common/someUtilsForSchemaForm'
import BinaryFileEditor from '@/components/BinaryFileEditor.vue'

const httpsURLReg = /^https:\/\/.+$/i
const SAPsSSLFieldReg = /^(keyfile|certfile|cacertfile)_(?<target>token|sendmsg)$/

export default {
  name: 'ResourceDialog',

  mixins: [handleMongoDBSRV('resource')],

  components: { KeyAndValueEditor, FileEditor, ConfigSelect, BinaryFileEditor },

  inheritAttrs: false,

  props: {
    value: {},
    visible: {
      type: Boolean,
      default: false,
    },
    oper: {
      type: String,
      default: 'add',
    },
    editItem: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      loadingButton: undefined,
      showMoreItem: false,
      configLoading: false,
      selfVisible: false,
      resourceTypes: [],
      configList: [],
      wholeConfigList: [],
      originConfigList: [],
      originRules: {
        config: {},
      },
      originRecord: {
        config: {},
      },
      types: [],
      selectedResource: {
        name: '',
        description: '',
        params: {},
        title: '',
      },
      record: {
        config: {},
        description: '',
        type: '',
        id: `resource:${Math.random().toString().slice(3, 9)}`,
      },
      rules: {
        config: {},
        type: { required: true, message: this.$t('General.pleaseChoose') },
        id: { required: true, validator: (rules, value) => verifyID(value, this.oper === 'edit') },
      },
    }
  },

  computed: {
    availableTypes() {
      const types =
        this.types.length > 0 ? this.resourceTypes.filter(($) => this.types.includes($.name)) : this.resourceTypes
      return types.sort((prev, next) => prev.title.localeCompare(next.title))
    },
    disabledSelect() {
      return this.types.length === 1 || this.oper === 'edit'
    },
    dialogVisible: {
      get() {
        return this.visible || this.selfVisible
      },
      set(val) {
        this.selfVisible = false
        this.$emit('update:visible', val)
      },
    },
    rawValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      },
    },
    sslValue() {
      const { ssl } = this.record.config
      return ssl
    },
    isSAP() {
      return this.record.type === 'sap_event_mesh'
    },
    /* ForSQP */
    isEnableTokenSSL() {
      if (!this.isSAP) {
        return false
      }
      const URL = this.record.config.token_endpoint_uri || ''
      return httpsURLReg.test(URL)
    },
    /* ForSAP */
    isEnableSendSSL() {
      if (!this.isSAP) {
        return false
      }
      const URL = this.record.config.send_message_uri || ''
      return httpsURLReg.test(URL)
    },
  },

  watch: {
    dialogVisible(val) {
      if (!val) {
        this.loadingButton = undefined
      }
    },
  },

  methods: {
    deleteParamsByKeys,
    deleteRulesByKeys,
    getOtherExtraConfigs,
    diffConfigList,
    isParamBoolType,
    isParamSSLType,
    getParamItemSpan,
    clearForm() {
      if (this.$refs.record) {
        setTimeout(() => {
          this.$refs.record.resetFields()
          this.record = {
            config: {},
            description: '',
            type: '',
            id: `resource:${Math.random().toString().slice(3, 9)}`,
          }
          this.wholeConfigList = []
          this.configList = []
        }, 10)
      }
    },

    resourceTypeChange(name) {
      this.record.name = name
      this.selectedResource = this.resourceTypes.find(($) => $.name === name)

      this.configLoading = true
      this.wholeConfigList = []
      this.configList = []

      setTimeout(this.loadConfigList, 200)
    },

    loadConfigList() {
      const { params } = this.selectedResource
      const { form, rules } = renderParamsForm(params, 'config')
      this.rules.config = rules

      this.record.config = {}
      this.wholeConfigList = form
      this.showMoreItem = false
      this.configList = this.wholeConfigList
      this.storeOriginData({ form, rules })

      this.setRsSetNameFieldRequired()

      if (this.oper === 'edit') {
        this.assignValuesToRecord()
      } else {
        form.forEach(({ key, value }) => {
          this.$set(this.record.config, key, value)
        })
      }
      this.configLoading = false
      setTimeout(this.$refs.record.clearValidate, 10)
    },

    cleanFileContent(config) {
      const falseValues = [false, 'false']
      // if SSL is disabled, clean the file content
      if (falseValues.includes(config.ssl) || falseValues.includes(config.https_enabled)) {
        config.verify = false
        Object.keys(config).forEach((key) => {
          const oneValue = config[key]
          const paramItem = this.findParamItemByKey(key)
          if (
            typeof oneValue === 'object' &&
            Object.keys(oneValue).includes('file') &&
            this.isParamSSLType(paramItem)
          ) {
            config[key] = {
              file: '',
              filename: '',
            }
          }
        })
      }
    },

    /**
     * just be called when type is edit
     */
    assignValuesToRecord() {
      const record = _.cloneDeep(this.editItem)
      const { configVal, description, type, id } = record
      Object.assign(this.record, { type, id, description })
      Object.keys(configVal).forEach((key) => {
        const value = configVal[key]
        this.$set(this.record.config, key, value)
      })
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

    showSAPsSSLField(fieldKey) {
      if (!SAPsSSLFieldReg.test(fieldKey)) {
        return true
      }
      const { target } = fieldKey.match(SAPsSSLFieldReg).groups || {}
      if (!target) {
        return true
      }
      if (target === 'token') {
        return this.isEnableTokenSSL
      }
      return this.isEnableSendSSL
    },

    showSSLField(fieldKey) {
      const typesNeedSpecialHandling = ['bridge_pulsar', 'web_hook']
      const params = this.record.config
      const httpsEnabled = ['true', true].includes(params.https_enabled)
      const SSLEnabled = ['true', true].includes(params.ssl)
      const noController = params.ssl === undefined && params.https_enabled === undefined
      const { type } = this.record
      if (!(typesNeedSpecialHandling.includes(type) || this.isSAP)) {
        return httpsEnabled || SSLEnabled || noController
      }
      if (this.isSAP) {
        return this.showSAPsSSLField(fieldKey)
      }
      if (type === 'bridge_pulsar') {
        return /^pulsar\+ssl:\/\/.+$/i.test(params.servers)
      }
      return httpsURLReg.test(params.url)
    },

    /**
     * for GCP
     */
    fileEditorAccept(field) {
      if (this.record.type === 'bridge_gcp_pubsub' && field.key === 'service_account_json') {
        return '.json'
      }
      return undefined
    },

    async handleEdit(record) {
      const { configVal } = this.editItem
      const { config, description } = record
      const notChangeInfos = _.isEqual(configVal, config) && description === this.editItem.description
      if (notChangeInfos) {
        this.dialogVisible = false
        this.selfVisible = false
        return
      }
      const RequestEditResource = async () => {
        try {
          const resource = await editResource(record)
          this.handleOperateSuccess(false, resource.id)
        } catch (err) {
          setTimeout(() => {
            this.loadingButton = undefined
          }, 100)
        }
      }
      this.$confirm(this.$t('RuleEngine.editResourceTips'), {
        type: 'warning',
        cancelButtonText: this.$t('Base.cancel'),
        confirmButtonText: this.$t('Base.confirm'),
      })
        .then(async () => {
          this.loadingButton = 'createButton'
          RequestEditResource()
        })
        .catch(() => {})
    },

    handleOperateSuccess(isTest, id) {
      // test request not return id
      setTimeout(() => {
        this.loadingButton = undefined
      }, 100)
      if (isTest) {
        if (this.dialogVisible) {
          this.$message.success(this.$t('RuleEngine.resourceAvailable'))
        }
        return
      }
      const successMsg = this.oper === 'add' ? this.$t('Base.createSuccess') : this.$t('Base.editSuccess')
      this.$message.success(successMsg)
      this.$emit('created', id)
      this.dialogVisible = false
      this.selfVisible = false
    },

    findParamItemByKey(keyForFind) {
      return findParamItemByKey(this.configList, keyForFind)
    },

    async handleCreate(test = false) {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.loadingButton = test ? 'testButton' : 'createButton'
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
      try {
        // edit
        if (this.oper === 'edit' && !test) {
          this.loadingButton = undefined
          this.handleEdit(this.record)
          return
        }
        // add or test
        const resource = await createResource(this.record, test)
        this.handleOperateSuccess(test, resource.id)
      } catch (err) {
        setTimeout(() => {
          this.loadingButton = undefined
        }, 100)
      }
    },

    handleCache() {
      this.dialogVisible = false
      this.selfVisible = false
      this.$emit('cache', true)
    },

    async loadData() {
      this.types = []
      this.resourceTypes = await loadResourceTypes()
      if (this.oper === 'edit') {
        const { type } = this.editItem
        this.resourceTypeChange(type)
      }
    },

    setup(options = {}) {
      this.selfVisible = true
      const { types = [] } = options
      this.loadData().then(() => {
        this.types = types
        this.record.type = types[0]
        this.resourceTypeChange(this.record.type)
      })
    },
  },
}
</script>

<style lang="scss">
.resource-dialog {
  .line {
    width: 100%;
    margin: 10px auto 20px auto;
    background-color: #edeef2;
  }

  .show-more {
    text-align: center;
    a {
      position: relative;
      text-decoration: none;
    }
    a::before {
      content: '';
      position: absolute;
      left: -215px;
      top: 8px;
      z-index: 9;
      width: 200px;
      height: 1px;
      background-color: #edeef2;
    }
    a::after {
      content: '';
      position: absolute;
      right: -215px;
      top: 8px;
      z-index: 9;
      width: 200px;
      height: 1px;
      background-color: #edeef2;
    }
  }

  .el-form-item {
    .el-select {
      &:not(.reset-width) {
        width: 330px;
      }

      width: 100%;
    }

    .el-form-item__label {
      overflow: hidden;
      padding-bottom: 0;
      font-size: 12px;
      word-break: break-all;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  .config-item-wrapper {
    min-height: 100px;

    .params-loading-wrapper {
      padding: 0 32px;
    }

    .el-input,
    .el-select {
      width: 200px !important;
    }
  }
  .el-col-12 {
    .el-form-item__label {
      min-height: 32px;
    }
  }
}
</style>
