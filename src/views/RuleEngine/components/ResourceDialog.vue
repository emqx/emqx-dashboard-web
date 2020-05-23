<template>
  <el-dialog
    :title="$t('RuleEngine.createResources')"
    class="resource-dialog"
    width="520px"
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    v-on="$listeners"
    @open="loadData"
    @close="clearForm"
  >
    <el-form
      ref="record"
      :model="record"
      :rules="rules"
      label-position="top"
      size="small"
    >
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
          :disabled="!record.type"
          type="primary"
          style="margin-left: 20px"
          @click="handleCreate(true)"
        >
          {{ $t('RuleEngine.testConnection') }}
        </el-button>
      </el-form-item>

      <el-form-item style="width: 330px" prop="description" :label="$t('RuleEngine.resourceName')">
        <el-input v-model="record.description" :placeholder="$t('RuleEngine.pleaseEnter')"></el-input>
      </el-form-item>

      <el-row v-if="record.type" class="config-item-wrapper" :gutter="20">
        <div v-if="configLoading" class="params-loading-wrapper">
          <a-skeleton active></a-skeleton>
        </div>
        <template v-else-if="configList.length > 0">
          <div class="line"></div>
          <el-col
            v-for="(item, i) in configList"
            :key="i"
            :span="item.type === 'textarea' || item.type === 'object' ? 24 : 12"
          >
            <el-form-item v-bind="item.formItemAttributes">
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
                  v-else
                  v-model="record.config[item.key]"
                  v-bind="item.bindAttributes"
                >
                </el-input>
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

                <emq-select
                  v-else
                  v-model="record.config[item.key]"
                  v-bind="item.bindAttributes"
                  class="reset-width"
                >
                </emq-select>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>

    </el-form>

    <div slot="footer" class="dialog-align-footer">
      <el-button size="small" @click="handleCache">{{ $t('Base.cancel') }}</el-button>
      <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate(false)">{{ $t('Base.confirm') }}</el-button>
    </div>

  </el-dialog>
</template>


<script>
import { loadResourceTypes, createResource } from '@/api/rules'
import { renderParamsForm } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'

export default {
  name: 'ResourceDialog',

  components: { KeyAndValueEditor },

  inheritAttrs: false,

  props: {
    // eslint-disable-next-line
    value: {},
    visible: {
      type: Boolean,
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
        description: { required: true, message: this.$t('RuleEngine.pleaseEnter') },
        type: { required: true, message: this.$t('RuleEngine.pleaseChoose') },
      },
    }
  },

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

      setTimeout(this.loadConfigList, 200)
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
      const resource = await createResource(this.record, test)
      if (test) {
        this.$message.success(this.$t('RuleEngine.resourceAvailable'))
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
    width: 95%;
    margin: 30px auto 28px auto;
    background-color: #EDEEF2;
  }

  .el-form-item {
    .el-input {
      width: 100%;
    }

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

    .el-input, .el-select {
      width: 200px !important;
    }
  }
}
</style>
