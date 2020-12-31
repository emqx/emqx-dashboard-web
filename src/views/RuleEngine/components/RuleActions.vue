<template>
  <div class="rule-actions">
    <div v-for="(item, i) in rawValue" :key="i" class="action-item">
      <div class="action-item-head">
        <div class="action-item-type">
          <div class="title">{{ $t('RuleEngine.actionType') }}</div>
          <div class="desc">{{ (item._config || {}).title }} ({{ item.name }})</div>
        </div>
        <div v-if="!disabled" class="action-item-btn">
          <span class="btn" @click="editAction(item, i)">
            {{ $t('RuleEngine.edit') }}
          </span>
          <span class="btn" @click="removeAction(i)">
            {{ $t('RuleEngine.remove') }}
          </span>
          <div v-if="!item.fallbacks.length" class="fallbacks">
            <el-popover
              placement="top-start"
              trigger="hover"
              :open-delay="500"
              :content="$t('RuleEngine.fallbackActionCreate')"
            >
              <el-button slot="reference" type="text" icon="el-icon-plus" @click="handleAddFallbacks(item)">
                {{ $t('RuleEngine.fallbackAction') }}
              </el-button>
            </el-popover>
          </div>
        </div>

        <div v-else class="action-item-btn action-item-type">
          <span class="title">{{ $t('RuleEngine.success') }} </span>
          <span class="desc">{{ item.success }}</span>
          <span class="title">{{ $t('RuleEngine.fail') }} </span>
          <span class="desc">{{ item.failed }}</span>
        </div>
      </div>
      <div class="action-item-description">
        {{ (item._config || {}).description }}
      </div>

      <div v-if="item._value" class="action-item-params">
        <div v-if="disabled" class="action-item-field">
          <div class="title">
            {{ $t('RuleEngine.detailedMetrics') }}
          </div>
          <div class="value">
            <span class="btn btn-default show-btn" @click="toggleShowMetrics(item)">
              {{ item.showList ? $t('RuleEngine.hide') : $t('RuleEngine.view') }}
            </span>
          </div>
        </div>
        <div v-for="(itemValue, itemValueIndex) in item._value" :key="itemValueIndex" class="action-item-field">
          <div class="title">{{ itemValue.label }}</div>
          <div class="value">{{ itemValue.value }}</div>
        </div>
      </div>

      <div v-if="disabled && item.showList" class="metrics-detail">
        <div class="main-title">
          {{ $t('RuleEngine.actionMetricsTips') }}
        </div>
        <div v-for="(metric, itemMetricIndex) in item.metrics" :key="itemMetricIndex" class="item">
          <span class="title">
            {{ $t('RuleEngine.node') }}
          </span>
          <span class="value">
            {{ metric.node }}
          </span>

          <span class="title">{{ $t('RuleEngine.success') }} </span>
          <span class="value">{{ metric.success }}</span>

          <span class="title">{{ $t('RuleEngine.fail') }} </span>
          <span class="value">{{ metric.failed }}</span>
        </div>
      </div>

      <template v-if="item.fallbacks && item.fallbacks.length">
        <el-divider></el-divider>
        <div v-for="(fallback, k) in item.fallbacks" :key="k" class="action-item error-action">
          <div class="action-item-head">
            <div class="action-item-type">
              <div class="title">{{ $t('RuleEngine.actionType') }}</div>
              <div class="desc">{{ (fallback._config || {}).title }} ({{ fallback.name }})</div>
            </div>
            <div v-if="!disabled" class="action-item-btn">
              <span class="btn" @click="editFallback(item, fallback, i)">
                {{ $t('RuleEngine.edit') }}
              </span>
              <span class="btn" @click="removeFallback(item)">
                {{ $t('RuleEngine.remove') }}
              </span>
              <div class="fallbacks">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :open-delay="500"
                  :content="$t('RuleEngine.fallbackActionTip')"
                >
                  <span slot="reference">
                    {{ $t('RuleEngine.fallbackAction') }}
                  </span>
                </el-popover>
              </div>
            </div>
            <div v-else class="action-item-btn action-item-type">
              <span class="title">{{ $t('RuleEngine.success') }} </span>
              <span class="desc">{{ showFallbacksMtrics(fallback, 'success') }}</span>
              <span class="title">{{ $t('RuleEngine.fail') }} </span>
              <span class="desc">{{ showFallbacksMtrics(fallback, 'failed') }} </span>
            </div>
          </div>

          <div class="action-item-description">
            {{ (actionsMap[fallback.name] || {}).description }}
          </div>

          <div v-if="fallback._value" class="action-item-params">
            <div v-if="disabled" class="action-item-field">
              <div class="title">
                {{ $t('RuleEngine.detailedMetrics') }}
              </div>
              <div class="value">
                <span class="btn btn-default show-btn" @click="toggleShowMetrics(fallback)">
                  {{ fallback.showList ? $t('RuleEngine.hide') : $t('RuleEngine.view') }}
                </span>
              </div>
            </div>
            <div
              v-for="(fallbackValue, fallbackValueIndex) in fallback._value"
              :key="fallbackValueIndex"
              class="action-item-field"
            >
              <div class="title">{{ fallbackValue.label }}</div>
              <div class="value">{{ fallbackValue.value }}</div>
            </div>
          </div>

          <div v-if="disabled && fallback.showList" class="metrics-detail">
            <div class="main-title">
              {{ $t('RuleEngine.actionMetricsTips') }}
            </div>
            <div
              v-for="(fallbackMetric, fallbackmetricIndex) in fallback.metrics"
              :key="fallbackmetricIndex"
              class="item"
            >
              <span class="title">
                {{ $t('RuleEngine.node') }}
              </span>
              <span class="value">
                {{ fallbackMetric.node }}
              </span>
              <span class="title">{{ $t('RuleEngine.success') }} </span>
              <span class="value">{{ fallbackMetric.success }}</span>
              <span class="title">{{ $t('RuleEngine.fail') }} </span>
              <span class="value">{{ fallbackMetric.failed }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <el-button v-if="!disabled" size="small" icon="el-icon-plus" @click="addAction">
      {{ $t('RuleEngine.addAction') }}
    </el-button>

    <el-dialog :visible.sync="actionDialogVisible" :title="actionDialogTitle" width="520px">
      <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
        <el-form-item prop="name" :label="$t('RuleEngine.actionType')">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-select class="reset-width" v-model="actionCategory" @change="actionCategoryChange">
                <el-option
                  v-for="(value, index) in actionCategoryOptions"
                  :key="index"
                  :label="$t(`RuleEngine.${value}`)"
                  :value="value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              <emq-select
                class="reset-width"
                v-model="record.name"
                :field="{ options: availableActions[actionCategory] }"
                :field-name="{ label: 'title', value: 'name' }"
                style="width: 240px;"
                @change="actionTypeChange"
              >
              </emq-select>
            </el-col>
          </el-row>
        </el-form-item>

        <div v-if="selectedAction.title.length - selectedAction.description.length > 18" class="action-description">
          {{ selectedAction.description }}
        </div>

        <el-form-item v-if="selectedAction.params.$resource" prop="params.$resource" label="">
          <span slot="label">
            {{ $t('RuleEngine.useOfResources') }}
            <el-popover trigger="hover" width="220" placement="top">
              <div class="emq-popover-content" v-html="$t('RuleEngine.resourceSelectTip')"></div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </span>
          <emq-select
            v-model="record.params.$resource"
            :field="{ options: availableResources }"
            :field-name="{ label: 'id', value: 'id' }"
            class="reset-width"
            style="width: 403px;"
            @visible-change="checkResource"
          >
            <div slot="option" slot-scope="{ item }" class="custom-option" :title="item.description">
              <span class="key">{{ item.description || item.id }}</span>
              <span class="value">{{ item.config.title }}</span>
            </div>
          </emq-select>

          <span class="tips btn" icon="el-icon-plus" @click="toCreateResource">
            {{ $t('RuleEngine.createNew') }}
          </span>
        </el-form-item>

        <div v-if="selectedAction.params.$resource" class="line"></div>

        <el-row v-if="paramsLoading || paramsList.length > 0" class="params-item-wrapper" :gutter="50">
          <div v-if="paramsLoading" class="params-loading-wrapper">
            <a-skeleton active></a-skeleton>
          </div>
          <template v-else>
            <el-col
              v-for="(item, i) in paramsList"
              :key="i"
              :span="item.type === 'textarea' || item.type === 'object' ? 24 : 12"
            >
              <el-form-item :class="item.key === 'sql' ? 'code-editor__item' : ''" v-bind="item.formItemAttributes">
                <template v-if="item.formItemAttributes.description" slot="label">
                  {{ item.formItemAttributes.label }}
                  <el-popover trigger="hover" width="220" placement="top">
                    <div class="emq-popover-content" v-html="item.formItemAttributes.description"></div>
                    <i slot="reference" class="el-icon-question"></i>
                  </el-popover>
                </template>
                <template v-if="item.elType === 'object'">
                  <key-and-value-editor v-model="record.params[item.key]"></key-and-value-editor>
                </template>
                <template v-else-if="item.elType === 'cfgselect'">
                  <config-select
                    v-model="record.params[item.key]"
                    v-bind="item.bindAttributes"
                    class="reset-width"
                    :extraConfigs="item.extraConfigs"
                    @updateConfig="addConfigAccordingType"
                  >
                  </config-select>
                </template>
                <template v-else-if="item.elType !== 'select'">
                  <el-input
                    v-if="item.type === 'number'"
                    v-model.number="record.params[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </el-input>
                  <el-input
                    v-else-if="item.type === 'password'"
                    v-model="record.params[item.key]"
                    v-bind="item.bindAttributes"
                    show-password
                  >
                  </el-input>
                  <div v-else-if="item.key === 'sql'" class="monaco-container monaco-action__sql">
                    <monaco
                      :id="`${record.name}-sql${Math.random().toString(16).slice(3)}`"
                      v-model="record.params.sql"
                      lang="sql"
                    >
                    </monaco>
                  </div>
                  <el-input v-else v-model="record.params[item.key]" v-bind="item.bindAttributes"> </el-input>
                </template>
                <template v-else>
                  <emq-select
                    v-if="item.type === 'number'"
                    v-model.number="record.params[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </emq-select>
                  <emq-select v-else v-model="record.params[item.key]" v-bind="item.bindAttributes"> </emq-select>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button size="small" @click="handleCancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate">
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <resource-dialog ref="resource" @created="confirmResource" @cache="confirmResource(null)"> </resource-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash'
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { loadActionsList, loadResource } from '@/api/rules'
import { renderParamsForm } from '@/common/utils'
import ResourceDialog from '@/views/RuleEngine/components/ResourceDialog.vue'
import Monaco from '@/components/Monaco'
import { setTimeout } from 'timers'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import ConfigSelect from '@/components/ConfigSelect'

export default {
  name: 'RuleActions',

  components: {
    ResourceDialog,
    Monaco,
    KeyAndValueEditor,
    ConfigSelect,
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    event: {
      type: String,
      default: 'message.publish',
    },
  },

  data() {
    return {
      actionDialogTitle: this.$t('RuleEngine.addActions'),
      actionDialogVisible: false,
      isFallbacks: false,
      setRefresh: false,
      actionsMap: {},
      paramsList: [],
      paramsLoading: false,
      currentEditIndex: 0,
      currentOper: '',
      currentAction: {},
      actionCategory: '',
      actionCategoryOptions: [],
      originParamsList: [],
      originRules: {
        name: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        params: {
          $resource: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        },
      },
      originRecord: {
        name: '',
        params: {
          $resource: '',
        },
        fallbacks: [],
      },
      record: {
        name: '',
        params: {
          $resource: '',
        },
        fallbacks: [],
      },
      rules: {
        name: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        params: {
          $resource: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        },
      },
      selectedAction: {
        title: '',
        description: '',
        params: {
          $resource: '',
        },
        fallbacks: [],
      },
      actions: [], // 全部 actions
      resources: [], // 全部资源
    }
  },

  computed: {
    rawValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      },
    },
    availableActions() {
      const data = this.actions
        .filter(($) => ['$any', this.event].includes($.for))
        .sort((prev, next) => prev.title.localeCompare(next.title))
      const unique = (arr) => [...new Set(arr)]
      this.actionCategoryOptions = unique(data.map((item) => item.category))
      const actionCategoryDict = {}
      this.actionCategoryOptions.forEach((item) => {
        const res = []
        data.forEach((cate) => {
          if (cate.category === item) {
            res.push(cate)
            actionCategoryDict[item] = res
          }
        })
      })
      if (!this.record.name && data[0]) {
        this.record.name = data[0].name
        this.actionTypeChange(this.record.name)
        this.actionCategory = this.actionCategoryOptions[0]
      }
      return actionCategoryDict
    },
    availableResources() {
      const { types } = this.selectedAction
      if (!types) {
        return []
      }
      return this.resources.filter(($) => types.includes($.type))
    },
  },

  watch: {
    actionDialogVisible(val) {
      if (!val) {
        this.initData()
        this.isFallbacks = false
      }
    },
  },

  created() {
    this.loadActions()
  },

  methods: {
    initData() {
      this.record = {
        name: '',
        params: {
          $resource: '',
        },
        fallbacks: [],
      }
      this.originRecord = {
        name: '',
        params: {
          $resource: '',
        },
        fallbacks: [],
      }
      this.currentAction = {}
    },

    toggleShowMetrics(item) {
      const { showList = false } = item
      this.$set(item, 'showList', !showList)
    },

    atDialogClose() {
      setTimeout(() => {
        this.$refs.record.clearValidate()
      }, 10)
    },

    async handleCreate() {
      this.initRecordEnableBatch()
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      // To boolean
      if (this.record.params) {
        Object.keys(this.record.params).forEach((key) => {
          const value = this.record.params[key]
          if (value === 'true' || value === 'false') {
            this.record.params[key] = JSON.parse(value)
          }
        })
      }
      let action = {}
      if (this.isFallbacks) {
        action = { ...this.record }
        if (this.currentOper === 'edit') {
          this.currentAction.fallbacks = []
        }
        this.currentAction.fallbacks.push(action)
      } else {
        action = { ...this.record }
        if (this.currentOper === 'edit') {
          this.rawValue.splice(this.currentEditIndex, 1, action)
        } else if (this.currentOper === 'add') {
          this.rawValue.push(action)
        }
      }
      if (action.params && !action.params.$resource) {
        delete action.params.$resource
      }
      this.fillRawValue()
      this.actionDialogVisible = false
      this.atDialogClose()
    },

    handleCancel() {
      this.actionDialogVisible = false
      this.atDialogClose()
    },

    checkResource(open = false) {
      if (open && this.availableResources.length === 0) {
        this.loadResourceData()
      }
    },

    toCreateResource() {
      const { types = [] } = this.selectedAction
      this.$refs.resource.setup({ types, action: 'create' })
      this.actionDialogVisible = false
      sessionStorage.setItem(
        'currentAction',
        JSON.stringify({
          record: this.record,
          paramsList: this.paramsList,
          originRecord: this.originRecord,
          originParamsList: this.originParamsList,
          actionCategory: this.actionCategory,
          actionCategoryOptions: this.actionCategoryOptions,
          types,
        }),
      )
    },

    confirmResource(id) {
      setTimeout(() => {
        if (this.$refs.record) {
          this.$refs.record.clearValidate()
        }
      }, 10)
      this.actionDialogVisible = true
      const currentAction = sessionStorage.getItem('currentAction')
      if (currentAction) {
        const {
          record,
          paramsList,
          types,
          actionCategoryOptions,
          actionCategory,
          originParamsList,
          originRecord,
        } = JSON.parse(currentAction)
        this.record = record
        this.originRecord = originRecord
        this.originParamsList = originParamsList
        this.paramsList = paramsList
        this.selectedAction.types = types
        this.actionCategory = actionCategory
        this.actionCategoryOptions = actionCategoryOptions
        sessionStorage.removeItem('currentAction')
      }
      if (id) {
        this.record.params.$resource = id
      }
      this.loadResourceData()
    },

    async loadResourceData() {
      this.resources = await loadResource()
    },

    loadParamsList(oper) {
      this.currentOper = oper
      const { params } = this.selectedAction
      const configData = renderParamsForm(params, 'params')
      const { form, rules } = configData
      this.storeOriginData(configData, oper)
      if (oper === 'add') {
        this.record.params = {}
        form.forEach(({ key, value }) => {
          const _key = key
          let _value = value
          if (_key === 'sql' && _value === undefined) {
            _value = ''
          }
          this.$set(this.record.params, _key, _value)
        })
        this.$set(this.record.params, '$resource', '')
        if (this.$refs.record) {
          setTimeout(this.$refs.record.clearValidate, 0)
        }
      }
      this.paramsList = form
      this.rules.params = {
        $resource: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        ...rules,
      }
      this.paramsLoading = false
    },

    assignRecordParams(form) {
      const recordParams = {}
      form.forEach(({ key, value }) => {
        const _key = key
        let _value = value
        if (_key === 'sql' && _value === undefined) {
          _value = ''
        }
        this.$set(recordParams, _key, _value)
      })
      return recordParams
    },

    storeOriginData(configData, oper) {
      const { form, rules } = configData
      this.originParamsList = form
      this.originRules.params = {
        $resource: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        ...rules,
      }
      if (oper === 'add') {
        const { ...recordParams } = this.assignRecordParams(form)
        this.originRecord.params = recordParams
      }
    },

    addConfigAccordingType(extraConfigs, type, allExtraConfigs) {
      const otherType = type === 'true' ? 'false' : 'true'
      const otherExtraConfigs = allExtraConfigs[otherType]
      this.deleteHideItems(otherExtraConfigs)
      const { $resource } = this.record.params
      const [...commonParamsList] = this.originParamsList
      const { ...rulesCommonConfig } = this.originRules.params
      const { ...recordCommonConfig } = this.originRecord.params
      Object.assign(recordCommonConfig, { $resource })

      if (Object.keys(extraConfigs).length) {
        const configData = renderParamsForm(extraConfigs, 'params')
        const { form, rules } = configData
        this.paramsList = commonParamsList.concat(form)
        this.rules.params = Object.assign(rulesCommonConfig, rules)
        const { ...recordParams } = this.assignRecordParams(form)
        const addRecordParams = recordParams
        this.record.params = Object.assign(recordCommonConfig, addRecordParams)
      } else {
        this.paramsList = commonParamsList
        this.rules.params = rulesCommonConfig
        this.record.params = recordCommonConfig
      }
      this.paramsList.sort((prev, next) => prev.order - next.order)
      this.record.params.enable_batch = type

      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },

    deleteHideItems(extraConfigs) {
      const keys = Object.keys(extraConfigs)
      keys.forEach((key) => {
        delete this.originRecord.params[key]
      })
    },

    actionTypeChange(actionName, oper = 'add') {
      this.selectedAction = JSON.parse(JSON.stringify(this.actionsMap[actionName]))
      this.actionCategory = this.selectedAction.category
      this.paramsList = []
      this.paramsLoading = true
      setTimeout(this.loadParamsList(oper), 200)
      this.loadResourceData()
    },
    actionCategoryChange(cateName) {
      const changeActions = this.availableActions[cateName]
      if (changeActions[0]) {
        this.record.name = changeActions[0].name
        this.actionTypeChange(this.record.name)
      }
    },
    addAction() {
      this.actionDialogTitle = this.$t('RuleEngine.addActions')
      this.actionTypeChange(this.record.name, 'add')
      this.actionDialogVisible = true
    },
    editAction(one, index) {
      const item = _.cloneDeep(one)
      this.actionDialogTitle = this.$t('RuleEngine.editActions')
      this.currentEditIndex = index
      this.actionTypeChange(item.name, 'edit')
      this.initEnableBatch(item)
      this.record = { ...item }
      this.originRecord = { ...item }
      this.actionDialogVisible = true
    },
    initEnableBatch(item) {
      const { _config, params } = { ...item }
      const { enable_batch } = params
      if (enable_batch === undefined) {
        return
      }
      const { items } = _config.params.enable_batch
      const type = enable_batch.toString()
      const allExtraConfigs = items
      const extraConfigs = allExtraConfigs[type]
      this.addConfigAccordingType(extraConfigs, type, allExtraConfigs)
    },
    initRecordEnableBatch() {
      if (this.record.params.enable_batch !== undefined) {
        this.record.params.enable_batch = this.record.params.enable_batch.toString()
      }
    },
    removeAction(index) {
      this.rawValue.splice(index, 1)
    },

    async loadActions() {
      const actions = await loadActionsList()
      this.actions = actions
      actions.forEach((action) => {
        const { name } = action
        this.actionsMap[name] = action
      })
      this.fillRawValue()
    },

    fillRawValue() {
      const rawMethod = (row) => {
        row.forEach((item) => {
          // eslint-disable-next-line
          item._config = this.actionsMap[item.name]
          const {
            params,
            _config: { params: paramsTemplate },
            fallbacks,
          } = item
          // eslint-disable-next-line
          item._value = Object.entries(params).map(([k, v]) => ({
            label: (paramsTemplate[k] || {}).title,
            value: v,
            key: k,
            fallbacks,
          }))
        })
      }
      const { rawValue } = this
      rawMethod(rawValue)
      rawValue.forEach((item) => {
        rawMethod(item.fallbacks)
      })
    },

    handleAddFallbacks(action) {
      this.isFallbacks = true
      this.actionDialogTitle = this.$t('RuleEngine.addActions')
      this.actionDialogVisible = true
      this.currentAction = action
    },
    editFallback(action, fallbackVal, index) {
      const fallback = _.cloneDeep(fallbackVal)
      this.actionDialogTitle = this.$t('RuleEngine.editActions')
      this.currentEditIndex = index
      this.currentAction = action
      this.isFallbacks = true
      this.actionTypeChange(fallback.name, 'edit')
      this.initEnableBatch(fallback)
      this.record = { ...fallback }
      this.originRecord = { ...fallback }
      this.actionDialogVisible = true
    },
    removeFallback(action) {
      action.fallbacks = []
    },
    showFallbacksMtrics({ metrics }, type) {
      let success = 0
      let failed = 0
      metrics.forEach((item) => {
        success += item.success
        failed += item.failed
      })
      if (type === 'success') {
        return success
      }
      return failed
    },
  },
}
</script>

<style lang="scss">
.rule-actions {
  .show-btn {
    border-bottom: 1px dashed #d8d8d8;
  }

  .action-item .action-item-btn {
    .btn {
      margin-right: 5px;
      &:last-child {
        margin-right: 0px;
      }
    }
    .fallbacks {
      position: absolute;
      bottom: 5px;
      right: 22px;
      .el-button {
        font-size: 12px;
      }
      .el-button [class*='el-icon-'] + span {
        margin-left: 0px;
      }
    }
  }
  .error-action .action-item-btn {
    .fallbacks {
      position: absolute;
      bottom: -3px;
      right: 5px;
      color: #909399;
    }
  }

  .metrics-detail {
    margin-top: 16px;
    padding: 4px 0;
    font-size: 12px;
    color: #444;
    .main-title {
      color: #101010;
      margin-bottom: 8px;
    }
    .title {
      color: #888;
      padding-left: 8px;
    }
    .value {
      margin-left: 8px;
      margin-right: 20px;
    }
  }

  .action-item {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f2f2f2;
    border: 1px dashed #f2f2f2;
    transition: border 0.3s;
    position: relative;
  }
  .action-item.error-action {
    padding: 0;
    margin-bottom: 0;
  }

  .action-item-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;

    .action-item-type {
      font-size: 12px;

      .title {
        color: #888;
        float: left;
      }

      .desc {
        float: left;
        margin-left: 8px;
        color: #444;
        margin-right: 20px;
      }
    }
  }

  .action-item-description {
    font-size: 12px;
    color: #888;
    margin: 4px 0 12px 0;
  }

  .action-item-params {
    margin-top: 12px;
    margin-bottom: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    max-width: 80%;
    flex-wrap: wrap;

    .action-item-field {
      margin-right: 20px;
    }

    .title {
      color: #888;
      float: left;
    }

    .value {
      float: left;
      margin-left: 8px;
      color: #444;
    }
  }

  .el-form {
    .el-form-item {
      .el-input {
        width: 100%;
      }

      .el-select {
        &:not(.reset-width) {
          width: 330px;
        }
      }

      .el-form-item__label {
        padding-bottom: 0;
        font-size: 12px;
      }
    }
  }

  .action-description {
    margin-top: -10px;
    padding-bottom: 8px;
    font-size: 12px;
    margin-bottom: 3px;
    border-bottom: 1px solid #d8d8d8;
  }

  .tips {
    user-select: none;
    font-size: 12px;
    margin-left: 12px;
  }

  .line {
    background-color: #d8d8d8;
  }

  .params-item-wrapper {
    margin-top: 30px;
    min-height: 100px;

    .params-loading-wrapper {
      padding: 0 32px;
    }

    .el-input,
    .el-select {
      width: 200px !important;
    }

    .el-textarea {
      width: 330px;
    }

    .monaco-action__sql {
      height: 200px;
    }
  }
}

.create-guide {
  min-height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-option {
  display: flex;
  justify-content: space-between;

  .key {
    display: inline-block;
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
