<template>
  <div class="rule-actions">
    <div v-for="(item, i) in rawValue" :key="i" class="action-item">
      <div class="action-item-head">
        <div class="action-item-type">
          <div class="title">动作类型</div>
          <div class="desc">{{ item.name }}</div>
        </div>
        <div class="action-item-btn btn" @click="removeAction(i)">删除</div>
      </div>

      <div v-if="item._value" class="action-item-params">
        <div v-for="(item2, j) in item._value" class="action-item-field">
          <div class="title">{{ item2.label }}</div>
          <div class="value">{{ item2.value }}</div>
        </div>
      </div>

    </div>
    <el-button size="small" @click="addAction">添加动作</el-button>


    <el-dialog :visible.sync="addActionDialogVisible" title="新增动作" width="520px" @close="atDialogClose">
      <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
        <el-form-item prop="name" label="动作类型">
          <emq-select
            v-model="record.name"
            :field="{ options: availableActions }"
            :fieldName="{ label: 'title', value: 'name'}"
            @change="actionTypeChange"
          >
          </emq-select>
        </el-form-item>

        <div
          v-if="(selectedAction.title.length - selectedAction.description.length) > 18"
          class="action-description">
          {{ selectedAction.description }}
        </div>

        <el-form-item v-if="selectedAction.params.$resource" prop="params.$resource" label="使用资源">
          <emq-select
            v-model="record.params.$resource"
            :field="{ options: availableResources }"
            :fieldName="{ label: 'id', value: 'id'}"
            class="reset-width"
            style="width: 250px"
            @visible-change="checkResource"
          >
            <div class="resource-option" slot="option" slot-scope="{ item }">
              <span class="resource-state">
                <a-badge :status="item.status.is_alive ? 'success' : 'error'"></a-badge>
              </span>
              <span class="resource-id">{{ item.id }}</span>
              <span class="resource-name">{{ item.config.title }}</span>
            </div>
          </emq-select>

          <span class="tips btn" @click="toCreateResource">
            新建资源
          </span>
        </el-form-item>

        <div class="line"></div>

        <el-row v-if="paramsLoading || paramsList.length > 0" class="params-item-wrapper" :gutter="50">
          <div v-if="paramsLoading" class="params-loading-wrapper">
            <a-skeleton active></a-skeleton>
          </div>
          <template v-else>
            <el-col v-for="(item, i) in paramsList" :span="item.type === 'textarea' ? 24 : 12">
              <el-form-item v-bind="item.formItemAttributes">
                <template v-if="item.formItemAttributes.description" slot="label">
                  {{ item.formItemAttributes.label }}
                  <el-popover trigger="hover" placement="top-start">
                    <div class="emq-popover-content" v-html="item.formItemAttributes.description"></div>
                    <i slot="reference" class="el-icon-question"></i>
                  </el-popover>
                </template>
                <template v-if="item.elType !== 'select'">
                  <el-input
                    v-if="item.type === 'number'"
                    v-bind="item.bindAttributes"
                    v-model.number="record.params[item.key]"
                  >
                  </el-input>

                  <el-input
                    v-else
                    v-bind="item.bindAttributes"
                    v-model="record.params[item.key]"
                  >
                  </el-input>
                </template>
                <template v-else>
                  <emq-select
                    v-if="item.type === 'number'"
                    v-bind="item.bindAttributes"
                    v-model.number="record.params[item.key]"
                  >
                  </emq-select>

                  <emq-select
                    v-else
                    v-bind="item.bindAttributes"
                    v-model="record.params[item.key]"
                  >
                  </emq-select>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>

      </el-form>


      <div class="dialog-align-footer" slot="footer">
        <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate">确定</el-button>
        <el-button size="small" @click="handleCache">取消</el-button>
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
    value: {},
    event: {
      type: String,
      required: true,
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
          $resource: { required: true, message: '请选择' },
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

  methods: {
    atDialogClose() {
      setTimeout(this.$refs.record.clearValidate, 10)
    },
    async handleCreate() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      this.rawValue.push(this.record)
      this.fillRawValue()
      this.addActionDialogVisible = false
    },
    handleCache() {
      this.addActionDialogVisible = false
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
        $resource: { required: true, message: '请选择' },
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
      setTimeout(this.loadParamsList, 400)
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
      const rawValue = this.rawValue
      rawValue.forEach((item) => {

        item._config = this.actionsMap[item.name]
        const { params, _config: { params: paramsTemplate } } = item
        item._value = Object.entries(params).map(([k, v]) => ({
          label: (paramsTemplate[k] || {}).title,
          value: v,
          key: k,
        }))
      })
      this.rawValue = rawValue
    },
  },

  watch: {
    event() {

    },
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

  created() {
    this.loadActions()
  },
}
</script>


<style lang="scss">
.rule-actions {
  .action-item {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f2f2f2;
    border: 1px dashed #f2f2f2;
    transition: border .3s;

    &:hover {
      border: 1px dashed #d8d8d8;
    }
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
      }
    }
  }

  .action-item-params {
    margin-top: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    max-width: 80%;
    flex-wrap: wrap;

    .action-item-field {
      margin-right: 10px;
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

  .resource-id {
  }

  .resource-name {
    float: right;
    font-size: 12px;
    color: #8F9297;
    margin-left: 30px;
  }
}

</style>
