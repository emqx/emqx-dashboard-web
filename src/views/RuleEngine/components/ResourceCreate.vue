<template>
  <el-dialog
    title="创建资源"
    class="resource-dialog"
    width="520px"
    v-bind="$attrs"
    v-on="$listeners"
    :visible.sync="dialogVisible"
    @open="loadData"
    @close="clearForm"
  >
    <el-form
      :model="record"
      :rules="rules"
      ref="record"
      label-position="top"
      size="small"
    >
      <el-form-item prop="type" label="资源类型">
        <emq-select
          v-model="record.type"
          :disabled="disabledSelect"
          :field-name="{ label: 'title', value: 'name' }"
          :field="{ options: availableTypes }"
          @change="resourceTypeChange"
        >
        </emq-select>
        <el-button
          :disabled="!record.type"
          type="primary"
          style="margin-left: 20px"
          @click="handleCreate(true)"
        >
          测试连接
        </el-button>
      </el-form-item>

      <el-form-item style="width: 330px" prop="description" label="备注">
        <el-input v-model="record.description" placeholder="请输入"></el-input>
      </el-form-item>


      <el-row v-if="record.type" class="config-item-wrapper" :gutter="30">
        <div v-if="configLoading" class="params-loading-wrapper">
          <a-skeleton active></a-skeleton>
        </div>
        <template v-else-if="configList.length > 0">
          <div class="line"></div>
          <el-col v-for="(item, i) in configList" :span="item.type === 'textarea' || item.type === 'object' ? 24 : 12">
            <el-form-item v-bind="item.formItemAttributes">
              <template v-if="item.formItemAttributes.description" slot="label">
                {{ item.formItemAttributes.label }}
                <el-popover trigger="hover" placement="top-start">
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
                  v-bind="item.bindAttributes"
                  v-model.number="record.config[item.key]"
                >
                </el-input>

                <el-input
                  v-else
                  v-bind="item.bindAttributes"
                  v-model="record.config[item.key]"
                >
                </el-input>
              </template>

              <!-- select -->
              <template v-else>
                <emq-select
                  v-if="item.type === 'number'"
                  v-bind="item.bindAttributes"
                  v-model.number="record.config[item.key]"
                >
                </emq-select>

                <emq-select
                  v-else
                  v-bind="item.bindAttributes"
                  v-model="record.config[item.key]"
                >
                </emq-select>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>

    </el-form>

    <div class="dialog-align-footer" slot="footer">
      <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate(false)">确定</el-button>
      <el-button size="small" @click="handleCache">取消</el-button>
    </div>

  </el-dialog>
</template>


<script>
import { loadResourceTypes, loadResource, createResource } from '@/api/rules'
import { renderParamsForm } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'

export default {
  name: 'ResourceDialog',

  components: { KeyAndValueEditor },

  inheritAttrs: false,

  props: {
    value: {},
    visible: {
      default: false,
    },
  },

  data() {
    return {
      configLoading: false,
      selfVisible: false,
      resourceTypes: [],
      configList: [],
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
      },
      rules: {
        config: {},
        type: { required: true, message: '请选择' },
      },
    }
  },

  methods: {
    clearForm() {
      if (this.$refs.record) {
        setTimeout(() => {
          this.$refs.record.resetFields()
          this.configList = []
        }, 10)
      }
    },
    resourceTypeChange(name) {
      this.record.name = name
      this.selectedResource = this.resourceTypes.find($ => $.name === name)

      this.configLoading = true
      this.configList = []

      setTimeout(this.loadConfigList, 400)
    },
    loadConfigList() {
      const { params } = this.selectedResource
      const { form, rules } = renderParamsForm(params, 'config')
      this.rules.config = rules

      this.record.config = {}
      this.configList = form
      form.forEach(({ key, value }) => {
        this.$set(this.record.config, key, value)
      })
      this.configLoading = false
      setTimeout(this.$refs.record.clearValidate, 10)
    },
    async handleCreate(test = false) {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      const resource = await createResource(this.record, test)
      if (test) {
        this.$message.success('资源可用')
        return
      }
      this.$emit('created', resource.id)
      this.dialogVisible = false
      this.selfVisible = false
    },
    handleCache() {
      this.dialogVisible = false
      this.selfVisible = false
      this.$emit('cache', true)
    },
    async loadData() {
      this.types = []
      this.resourceTypes = await loadResourceTypes()
    },
    setup(options = {}) {
      this.selfVisible = true
      const { types = [], action } = options
      this.loadData().then(() => {
        this.types = types
        this.record.type = types[0]
        this.resourceTypeChange(this.record.type)
      })
    },
  },

  watch: {},

  computed: {
    availableTypes() {
      return this.types.length > 0 ? this.resourceTypes.filter($ => this.types.includes($.name)) : this.resourceTypes
    },
    disabledSelect() {
      return this.types.length === 1
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
  },

  created() {
  },
}
</script>


<style lang="scss">
.resource-dialog {
  .line {
    background-color: #d8d8d8;
  }

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

  .config-item-wrapper {
    margin-top: 30px;
    min-height: 100px;

    .params-loading-wrapper {
      padding: 0 32px;
    }

    .el-input, .el-select {
      width: 200px;
    }

    .el-textarea {
      width: 330px;
    }


  }
}
</style>
