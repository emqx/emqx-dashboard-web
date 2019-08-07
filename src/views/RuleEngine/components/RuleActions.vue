<template>
  <div class="rule-actions">
    <div v-for="(item, i) in rawValue" :key="i" class="action-item">
      <div class="action-item-head">
        <div class="action-item-type">
          <div class="title">{{ $t('RuleEngine.actionType') }}</div>
          <div class="desc">{{ (item._config || {}).title }} ({{ item.name }})</div>
        </div>
        <div
          v-if="!disabled"
          class="action-item-btn"
        >
          <!--<span class="btn" @click="editAction(item)">-->
          <!--编辑-->
          <!--</span>-->
          <span class="btn" @click="removeAction(i)">
            {{ $t('RuleEngine.delete') }}
          </span>
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
        <div v-for="(item2, j) in item._value" :key="j" class="action-item-field">
          <div class="title">{{ item2.label }}</div>
          <div class="value">{{ item2.value }}</div>
        </div>
      </div>

      <div v-if="disabled && item.showList" class="metrics-detail">
        <div class="main-title">
          {{ $t('RuleEngine.actionMetricsTips') }}
        </div>
        <div v-for="(item3, k) in item.metrics" :key="k" class="item">
          <span class="title">
            {{ $t('RuleEngine.node') }}
          </span>
          <span class="value">
            {{ item3.node }}
          </span>

          <span class="title">{{ $t('RuleEngine.success') }} </span>
          <span class="value">{{ item.success }}</span>

          <span class="title">{{ $t('RuleEngine.fail') }} </span>
          <span class="value">{{ item.failed }}</span>
        </div>
      </div>

    </div>


    <el-button
      v-if="!disabled"
      size="small"
      icon="el-icon-plus"
      @click="addAction"
    >
      {{ $t('RuleEngine.addAction') }}
    </el-button>

    <el-dialog
      :visible.sync="addActionDialogVisible"
      :title="$t('RuleEngine.addActions')"
      width="520px"
    >
      <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
        <el-form-item prop="name" :label="$t('RuleEngine.actionType')">
          <emq-select
            v-model="record.name"
            :field="{ options: availableActions }"
            :field-name="{ label: 'title', value: 'name'}"
            @change="actionTypeChange"
          >
          </emq-select>
        </el-form-item>

        <div
          v-if="(selectedAction.title.length - selectedAction.description.length) > 18"
          class="action-description"
        >
          {{ selectedAction.description }}
        </div>

        <el-form-item
          v-if="selectedAction.params.$resource"
          prop="params.$resource"
          :label="$t('RuleEngine.useOfResources')"
        >
          <emq-select
            v-model="record.params.$resource"
            :field="{ options: availableResources }"
            :field-name="{ label: 'id', value: 'id'}"
            class="reset-width"
            style="width: 330px"
            @visible-change="checkResource"
          >
            <div slot="option" slot-scope="{ item }" class="resource-option">
              <!--<span class="resource-state">-->
              <!--<a-badge :status="item.status.is_alive ? 'success' : 'error'"></a-badge>-->
              <!--</span>-->
              <span class="resource-id">{{ item.id }}</span>
              <span class="resource-name">{{ item.config.title }}</span>
            </div>
          </emq-select>

          <span class="tips btn" icon="el-icon-plus" @click="toCreateResource">
            {{ $t('RuleEngine.createNew') }}
          </span>
        </el-form-item>

        <div v-if="selectedAction.params.$resource" class="line"></div>

        <el-row
          v-if="paramsLoading || paramsList.length > 0"
          class="params-item-wrapper" :gutter="50"
        >
          <div v-if="paramsLoading" class="params-loading-wrapper">
            <a-skeleton active></a-skeleton>
          </div>
          <template v-else>
            <el-col
              v-for="(item, i) in paramsList"
              :key="i"
              :span="item.type === 'textarea' ? 24 : 12"
            >
              <el-form-item v-bind="item.formItemAttributes">
                <template v-if="item.formItemAttributes.description" slot="label">
                  {{ item.formItemAttributes.label }}
                  <el-popover trigger="hover" width="220" placement="top">
                    <div
                      class="emq-popover-content"
                      v-html="item.formItemAttributes.description"
                    >
                    </div>
                    <i slot="reference" class="el-icon-question"></i>
                  </el-popover>
                </template>
                <template v-if="item.elType !== 'select'">
                  <el-input
                    v-if="item.type === 'number'"
                    v-model.number="record.params[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </el-input>

                  <el-input
                    v-else
                    v-model="record.params[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </el-input>
                </template>
                <template v-else>
                  <emq-select
                    v-if="item.type === 'number'"
                    v-model.number="record.params[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </emq-select>

                  <emq-select
                    v-else
                    v-model="record.params[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </emq-select>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>

      </el-form>


      <div slot="footer" class="dialog-align-footer">
        <el-button size="small" @click="handleCache">
          {{ $t('RuleEngine.cancel') }}
        </el-button>
        <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate">{{
          $t('RuleEngine.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <resource-dialog ref="resource" @created="confirmResource" @cache="confirmResource(false)"></resource-dialog>
  </div>
</template>


<script>
import { loadActionsList, loadResource } from '@/api/rules'
import { renderParamsForm } from '@/common/utils'
import ResourceDialog from '@/views/RuleEngine/components/ResourceCreate'

export default {
  name: 'RuleActions',

  components: { ResourceDialog },

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
      addActionDialogVisible: false,
      resourceDialogVisible: false,
      setRefresh: false,
      actionsMap: {},
      paramsList: [],
      paramsLoading: false,
      record: {
        name: '',
        params: {
          $resource: '',
        },
      },
      rules: {
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
      const data = this.actions.filter($ => ['$any', this.event].includes($.for))
      if (!this.record.name && data[0]) {
        // eslint-disable-next-line
        this.record.name = data[0].name
        this.actionTypeChange(this.record.name)
      }
      return data
    },
    availableResources() {
      const { types } = this.selectedAction
      if (!types) {
        return []
      }
      return this.resources.filter($ => types.includes($.type))
    },
  },

  watch: {
    event() {

    },
  },

  created() {
    this.loadActions()
  },

  methods: {
    toggleShowMetrics(item) {
      const { showList = false } = item
      this.$set(item, 'showList', !showList)
    },
    editAction(item) {
      this.record = { ...item }
      this.addActionDialogVisible = true
      this.actionTypeChange(item.name)
    },
    atDialogClose() {
      setTimeout(() => {
        this.$refs.record.clearValidate()
        this.$refs.record.resetFields()
      }, 10)
    },
    async handleCreate() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      const action = JSON.parse(JSON.stringify(this.record))
      if (action.params && !action.params.$resource) {
        delete action.params.$resource
      }
      this.rawValue.push(action)
      this.fillRawValue()
      this.addActionDialogVisible = false
      this.atDialogClose()
    },
    handleCache() {
      this.addActionDialogVisible = false
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
      this.addActionDialogVisible = false
    },
    confirmResource(id) {
      this.addActionDialogVisible = true
      if (!id) {
        return
      }
      this.loadResourceData().then(() => {
        this.record.params.$resource = id
      })
    },
    async loadResourceData() {
      this.resources = await loadResource()
    },
    loadParamsList() {
      const { params } = this.selectedAction
      const { form, rules } = renderParamsForm(params, 'params')
      this.paramsList = form
      this.rules.params = {
        $resource: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
        ...rules,
      }
      this.record.params = {}
      form.forEach(({ key, value }) => {
        this.$set(this.record.params, key, value)
      })
      this.$set(this.record.params, '$resource', '')
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 0)
      }
      this.paramsLoading = false
    },
    actionTypeChange(actionName) {
      this.selectedAction = this.actionsMap[actionName]
      this.paramsList = []
      this.paramsLoading = true
      setTimeout(this.loadParamsList, 200)
      this.loadResourceData()
    },
    addAction() {
      this.addActionDialogVisible = true
    },
    removeAction(i) {
      this.rawValue.splice(i, 1)
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
      const { rawValue } = this
      rawValue.forEach((item) => {
        // eslint-disable-next-line
        item._config = this.actionsMap[item.name]
        const { params, _config: { params: paramsTemplate } } = item
        // eslint-disable-next-line
        item._value = Object.entries(params).map(([k, v]) => ({
          label: (paramsTemplate[k] || {}).title,
          value: v,
          key: k,
        }))
      })
      this.rawValue = rawValue
    },
  },
}
</script>


<style lang="scss">
.rule-actions {
  .show-btn {
    border-bottom: 1px dashed #d8d8d8;
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
    transition: border .3s;

    /*&:hover {*/
    /*border: 1px dashed #d8d8d8;*/
    /*}*/
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

    .el-input, .el-select {
      width: 200px !important;
    }

    .el-textarea {
      width: 330px;
    }


  }
}

.resource-option {
  .resource-state {

  }

  .resource-name {
    float: right;
    font-size: 12px;
    color: #888;
    margin-left: 30px;
  }
}

.create-guide {
  min-height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
