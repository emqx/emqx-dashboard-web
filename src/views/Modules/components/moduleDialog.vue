<template>
  <el-dialog
    :title="oper === 'add' ? $t('Modules.moduleAdd') : $t('Modules.moduleEdit')"
    class="module-dialog"
    width="520px"
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    v-on="$listeners"
    @open="loadData"
    @close="clearForm"
  >
    <el-form ref="record" :model="record" :rules="rules" label-position="top" size="small">
      <el-row class="config-item-wrapper" :gutter="20">
        <div v-if="configLoading" class="params-loading-wrapper">
          <a-skeleton active></a-skeleton>
        </div>
        <template v-else-if="configList.length > 0">
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
          </el-col>
          <el-col v-if="wholeConfigList.length > 8" :span="24" class="show-more">
            <a href="javascript:;" @click="showWholeList">
              {{ showMoreItem ? $t('Clients.collapse') : $t('Clients.expand') }}
              <i :class="showMoreItem ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </a>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-align-footer">
      <template v-if="oper == 'edit'">
        <el-button v-if="!moduleData.enabled" size="small" @click="toggleStatus(true)">{{
          $t('Modules.run')
        }}</el-button>
        <el-button v-else size="small" @click="toggleStatus(false)">{{ $t('Modules.stop') }}</el-button>
        <el-button size="small" @click="deleteModule">{{ $t('Base.delete') }}</el-button>
      </template>
      <el-button size="small" @click="handleCache">{{ $t('Base.cancel') }}</el-button>
      <el-button class="dialog-primary-btn" type="primary" size="small" @click="handleCreate()">
        <span v-if="oper === 'add'">{{ $t('Base.add') }}</span>
        <span v-else>{{ $t('Base.confirm') }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createModule, loadAllModules, updateModule, destroyModule } from '@/api/modules'
import { renderParamsForm, fillI18n } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'

export default {
  name: 'ModuleDialog',

  components: { KeyAndValueEditor },

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    moduleData: {
      type: Object,
      default: () => {},
    },
    oper: {
      type: String,
      default: 'add',
    },
    moduleName: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: 'addModule',
    },
  },

  data() {
    return {
      showMoreItem: false,
      configLoading: false,
      selfVisible: false,
      configList: [],
      wholeConfigList: [],
      record: {
        config: {},
      },
      rules: {
        config: {},
      },
      allModuleList: [],
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible || this.selfVisible
      },
      set(val) {
        this.selfVisible = false
        this.$emit('update:visible', val)
      },
    },
  },

  methods: {
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
    showWholeList() {
      if (this.showMoreItem === false) {
        this.showMoreItem = true
        this.configList = this.wholeConfigList
      } else {
        this.showMoreItem = false
        this.configList = this.wholeConfigList.slice(0, 8)
      }
    },
    clearForm() {
      if (this.$refs.record) {
        setTimeout(() => {
          this.$refs.record.resetFields()
          this.wholeConfigList = []
          this.configList = []
        }, 10)
      }
    },
    loadConfigList(paramsData) {
      this.configLoading = true
      const configData = renderParamsForm(paramsData, 'config')
      const { form, rules } = configData
      this.rules.config = rules
      this.record.config = {}
      this.wholeConfigList = form
      this.showMoreItem = false
      if (form.length > 8) {
        this.configList = form.slice(0, 8)
      } else {
        this.configList = form
      }
      form.forEach(({ key, value }) => {
        this.$set(this.record.config, key, value)
      })
      this.configLoading = false
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
    async handleCreate() {
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

      if (this.oper === 'add') {
        this.record.type = this.moduleData.type
        await createModule(this.record)
        this.$message.success(this.$t('Modules.moduleAddSuccess'))
        this.$router.push('/modules')
      } else {
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
      }
      this.closeDialog()
    },
    handleCache() {
      this.dialogVisible = false
      this.selfVisible = false
      this.$emit('cache', true)
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
        if (this.moduleData.config[item]) {
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
          this.closeDialog()
        })
        .catch(() => {})
    },
    async toggleStatus(val) {
      const data = { ...this.moduleData }
      data.enabled = val
      if (!val) {
        this.$msgbox
          .confirm(this.$t('Modules.thisActionWillStopTheModule'), {
            confirmButtonText: this.$t('Base.confirm'),
            cancelButtonText: this.$t('Base.cancel'),
            type: 'warning',
          })
          .then(async () => {
            await updateModule(this.moduleData.id, data)
            this.$message.success(this.$t('Modules.stopSuccess'))
            this.moduleData.enabled = val
            this.closeDialog()
          })
          .catch(() => {})
      } else {
        await updateModule(this.moduleData.id, data)
        this.$message.success(this.$t('Modules.startSuccess'))
        this.moduleData.enabled = val
        this.closeDialog()
      }
    },
    closeDialog() {
      setTimeout(() => {
        this.dialogVisible = false
        this.selfVisible = false
        if (this.oper === 'edit') {
          if (this.from === 'modules') {
            this.$emit('updateList')
          } else {
            this.$router.push('/modules')
          }
        }
      }, 200)
    },
  },
}
</script>

<style lang="scss">
.module-dialog {
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

    .el-input,
    .el-select {
      width: 200px !important;
    }
  }
}
</style>
