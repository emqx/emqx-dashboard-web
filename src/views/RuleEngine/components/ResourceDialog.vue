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
          <el-col
            v-for="(item, i) in configList"
            :key="i"
            :span="item.type === 'textarea' || item.type === 'object' || item.type === 'file' ? 24 : 12"
          >
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
              <el-form-item
                v-if="
                  ['true', true].includes(record.config['https_enabled']) ||
                  ['true', true].includes(record.config['ssl']) ||
                  (record.config['ssl'] === undefined && record.config['https_enabled'] === undefined)
                "
                v-bind="item.formItemAttributes"
              >
                <file-editor v-if="item.elType === 'file'" v-model="record.config[item.key]"></file-editor>
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
import { loadResourceTypes, createResource, editResource } from '@/api/rules'
import { renderParamsForm, verifyID } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import FileEditor from '@/components/FileEditor'
import _ from 'lodash'

export default {
  name: 'ResourceDialog',

  components: { KeyAndValueEditor, FileEditor },

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
        id: { required: true, validator: verifyID },
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
  },

  methods: {
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
      if (falseValues.includes(config.ssl) || falseValues.includes(config.https_enabled)) {
        config.verify = false
        Object.keys(config).forEach((key) => {
          const oneValue = config[key]
          if (typeof oneValue === 'object' && Object.keys(oneValue).includes('file')) {
            config[key] = {
              file: '',
              filename: '',
            }
          }
        })
      }
    },

    assignValuesToRecord() {
      const record = _.cloneDeep(this.editItem)
      const { configVal, description, type, id } = record
      Object.assign(this.record, { type, id, description })
      Object.keys(configVal).forEach((key) => {
        const value = configVal[key]
        this.$set(this.record.config, key, value)
      })
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
      this.$confirm(this.$t('RuleEngine.editResourceTips'), this.$t('Base.warning'), {
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

    handleOperateSuccess(test, id) {
      // test request not return id
      setTimeout(() => {
        this.loadingButton = undefined
      }, 100)
      if (test) {
        this.$message.success(this.$t('RuleEngine.resourceAvailable'))
        return
      }
      const successMsg = this.oper === 'add' ? this.$t('Base.createSuccess') : this.$t('Base.editSuccess')
      this.$message.success(successMsg)
      this.$emit('created', id)
      this.dialogVisible = false
      this.selfVisible = false
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
      padding-bottom: 0;
      font-size: 12px;
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
}
</style>
