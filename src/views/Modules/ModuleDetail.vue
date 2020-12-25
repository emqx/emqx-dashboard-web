<template>
  <div class="module-detail">
    <page-header>
      <div class="page-header-title-view">
        <div class="title">
          {{ moduleData.title[lang] ? moduleData.title[lang] : moduleData.title['en'] }}
        </div>
      </div>
      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ moduleData.description[lang] ? moduleData.description[lang] : moduleData.description['en'] }}
          </p>
        </div>
      </div>

      <div v-if="oper === 'edit'" class="page-header-top-start delete-btn" @click="deleteModule">
        <el-button type="danger" size="small">
          {{ $t('RuleEngine.delete') }}
        </el-button>
      </div>
    </page-header>
    <div class="app-wrapper">
      <el-card>
        <div class="emq-title module-title">
          {{ $t('Modules.configuration') }}
        </div>
        <el-form ref="record" :model="record" :rules="rules" label-position="top" size="small">
          <el-row class="config-item-wrapper" :gutter="30">
            <template v-if="configList.length > 0">
              <el-col :span="16">
                <div v-for="(item, i) in configList" :key="i">
                  <template v-if="item.key !== 'listener'">
                    <el-col
                      :span="item.type === 'textarea' || item.type === 'object' || item.type === 'array' ? 24 : 12"
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
                        <template v-else-if="item.elType === 'array'">
                          <array-editor
                            ref="arrayEditor"
                            v-model="record.config[item.key]"
                            :data="item.oneObjOfArray"
                            :isDadRequired="rules.config[item.key].length > 0"
                            @updateValidate="updateValidate"
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
              </el-col>
            </template>
            <div v-else class="params-loading-wrapper">
              <a-skeleton active></a-skeleton>
            </div>
          </el-row>
        </el-form>
      </el-card>
      <el-card v-if="Object.keys(listener).length" class="listener-wrapper">
        <div class="emq-title listener-title">
          {{ $t('Modules.listener') }}
        </div>
        <Listeners v-model="record.config['listeners']" :listenerData="listener"> </Listeners>
      </el-card>
    </div>
    <el-col :span="configList.length === 1 && fullSpanType.indexOf(configList[0].type) === -1 ? 9 : 16">
      <div class="button-group__center">
        <el-button size="small" @click="exitDetail(true)">{{ $t('Base.cancel') }}</el-button>
        <el-button
          :loading="buttonLoading"
          class="dialog-primary-btn"
          type="primary"
          size="small"
          @click="handleCreate()"
        >
          <span v-if="oper === 'add'">{{ $t('Base.add') }}</span>
          <span v-else>{{ $t('Base.confirm') }}</span>
        </el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
import { createModule, loadAllModules, updateModule, destroyModule } from '@/api/modules'
import { renderParamsForm, fillI18n } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import ArrayEditor from '@/components/ArrayEditor'
import Listeners from './components/Listeners'
import FileEditor from '@/components/FileEditor'
import ConfigSelect from '@/components/ConfigSelect'
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash'

export default {
  name: 'ModuleDetail',

  components: { KeyAndValueEditor, ArrayEditor, Listeners, FileEditor, ConfigSelect },

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
  },

  watch: {
    listeners: {
      deep: true,
      immediate: true,
      handler: 'handlelistenersChange',
    },
  },

  created() {
    this.loadData()
    this.initListeners()
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  },

  methods: {
    handlelistenersChange(val) {
      this.originRecord.config.listeners = _.cloneDeep(val)
    },
    updateValidate() {
      this.$refs.record.validate()
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
    cleanForm() {
      if (this.$refs.record) {
        setTimeout(() => {
          this.$refs.record.resetFields()
          this.configList = []
        }, 10)
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
          if (typeof oneValue === 'object' && Object.keys(oneValue).includes('file')) {
            config[key] = {
              file: '',
              filename: '',
            }
          }
        })
      }
    },
    async handleCreate() {
      const { arrayEditor } = this.$refs
      if (arrayEditor && arrayEditor[0]._data.innerValid === false) {
        return
      }
      const valid = await this.$refs.record.validate()
      if (!valid) {
        return
      }
      if (Object.keys(this.listener).length && !this.record.config.listeners.length) {
        this.$message.error(this.$t('Modules.emptyListenerTip'))
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

      this.cleanFileContent(config)
      if (this.oper === 'add') {
        this.buttonLoading = true
        this.record.type = this.moduleData.type
        const data = await createModule(this.record)
        const addedModules = JSON.parse(localStorage.getItem('addedModules')) || {}
        addedModules[data.type] = data.id
        localStorage.setItem('addedModules', JSON.stringify(addedModules))
        this.$message.success(this.$t('Modules.moduleAddSuccess'))
        this.exitDetail()
        this.buttonLoading = false
      } else {
        const isEdited = !_.isEqual(this.record.config, this.originRecord.config)
        if (isEdited) {
          this.$confirm(this.$t('Modules.editTip'), this.$t('Base.warning'), {
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
      this.cleanForm()
      setTimeout(() => {
        if (this.from === 'modules' || !isCancel) {
          this.$router.push('/modules')
        } else {
          this.$router.push(`/modules/select?id=${this.$route.query.id}&top=${this.$route.query.top}`)
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
    addConfigAccordingType(extraConfigs, type) {
      const [...commonConfig] = this.originConfigList
      const { ...rulesCommonConfig } = this.originRules.config
      const { ...recordCommonConfig } = this.originRecord.config
      if (Object.keys(extraConfigs).length) {
        const configData = renderParamsForm(extraConfigs, 'config')
        const { form, rules } = configData
        const addConfigs = {}
        form.forEach(({ key, value }) => {
          this.$set(addConfigs, key, value)
        })
        this.configList = commonConfig.concat(form)
        this.rules.config = Object.assign(rulesCommonConfig, rules)
        this.record.config = Object.assign(recordCommonConfig, addConfigs)
      } else {
        this.configList = commonConfig
        this.rules.config = rulesCommonConfig
        this.record.config = recordCommonConfig
      }
      this.record.config.type = type
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
  },
}
</script>

<style lang="scss">
.module-detail {
  .page-header-content {
    padding: 16px 20px;
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
    margin-bottom: 24px;
  }

  .listener-wrapper {
    margin-top: 24px;
  }

  .delete-btn {
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
