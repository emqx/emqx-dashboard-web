<template>
  <div class="config-detail">
    <el-row :gutter="12" class="config-form">
      <el-form
        ref="record"
        :class="from === 'listener' ? 'no-form-margin' : 'form-margin'"
        size="small"
        label-suffix=":"
        :label-width="labelWidth"
        label-position="right"
        :model="record"
        :rules="rules"
      >
        <template v-if="showConfigList.length">
          <template v-if="from === 'listener'">
            <el-col :span="12" class="form-item-desc">
              <el-form-item label="type" prop="type">
                <emq-select
                  :disabled="oper === 'edit'"
                  v-model="record['type']"
                  :field="{ options: typeOptions }"
                  @selectChange="addConfigsAccordingType"
                >
                </emq-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="form-item-desc">
              <span>{{ $t('Settings.listenerType') }}</span>
            </el-col>
          </template>
          <template v-if="oper === 'add'">
            <el-col :span="12" class="form-item-desc">
              <el-form-item label="name" prop="name">
                <el-input v-model="record['name']"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="form-item-desc">
              <span v-if="from === 'zone'">{{ $t('Settings.zoneName') }}</span>
              <span v-else>{{ $t('Settings.listenerName') }}</span>
            </el-col>
          </template>

          <div v-for="(item, index) in showConfigList" :key="index">
            <el-col :span="12">
              <el-form-item :label="item.key" v-bind="item.formItemAttributes">
                <template v-if="item.key === 'zone'">
                  <emq-select
                    v-model="record.configs[item.key]"
                    :field="{ options: listenerZoneOptions }"
                  >
                  </emq-select>
                </template>

                <template v-else>
                  <template v-if="item.elType !== 'select'">
                    <el-input
                      v-if="item.type === 'number'"
                      v-model.number="record.configs[item.key]"
                      v-bind="item.bindAttributes"
                    >
                    </el-input>
                    <el-input
                      v-else-if="item.type === 'password'"
                      v-model="record.configs[item.key]"
                      v-bind="item.bindAttributes"
                      show-password
                    >
                    </el-input>
                    <el-input
                      v-else
                      v-model="record.configs[item.key]"
                      v-bind="item.bindAttributes"
                    >
                    </el-input>
                  </template>
                  <template v-else>
                    <emq-select
                      v-if="item.type === 'number'"
                      v-model.number="record.configs[item.key]"
                      v-bind="item.bindAttributes"
                      class="reset-width"
                    >
                    </emq-select>
                    <emq-select
                      v-else
                      v-model="record.configs[item.key]"
                      v-bind="item.bindAttributes"
                      class="reset-width"
                    >
                    </emq-select>
                  </template>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="form-item-desc">
              <span>{{ item.formItemAttributes.description }}</span>
            </el-col>
          </div>
        </template>
      </el-form>
      <el-col v-if="nullKeys.length" :span="24" class="show-more">
        <a href="javascript:;" @click="toggleRecords">
          <span>
            {{ showMoreItems ? $t('Clients.collapse') : $t('Clients.expand') }}
            <i :class="showMoreItems ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </a>
      </el-col>
      <el-col class="button-group__center" :span="12">
        <el-button plain :disabled="selfDisabled" type="default" size="medium" @click="cancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button
          :disabled="selfDisabled"
          :loading="btnLoading"
          type="primary"
          size="medium"
          @click="save"
        >
          <span v-if="oper === 'add'">{{ $t('Base.add') }}</span>
          <span v-else>{{ $t('Base.apply') }}</span>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { loadZoneConfig, loadConfigSpec } from '@/api/settings'
import { renderParamsForm, verifyID, verifyListener } from '@/common/utils'
import _ from 'lodash'

export default {
  name: 'ConfigDetail',

  model: {
    prop: 'disabled',
    event: 'updateDisabled',
  },

  data() {
    return {
      hasValKeyConfigList: [],
      nullKeyConfigList: [],
      nullKeys: [],
      configList: [],
      showConfigList: [],
      rules: {
        configs: {},
        name: [{ required: true, validator: verifyID }],
      },
      record: {
        configs: {},
        name: '',
        type: 'tcp',
      },
      originRecord: {
        configs: {},
        name: '',
        type: 'tcp',
      },
      selfDisabled: true,
      showMoreItems: false,
      typeOptions: [
        { label: 'tcp', value: 'tcp' },
        { label: 'ssl', value: 'ssl' },
        { label: 'ws', value: 'ws' },
        { label: 'wss', value: 'wss' },
      ],
      configData: {},
      configOptions: {},
    }
  },

  props: {
    labelWidth: {
      type: String,
      default: '225px',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    oper: {
      type: String,
      default: 'add',
    },
    editConfig: {
      type: Object,
      default: () => {},
    },
    from: {
      type: String,
      default: '',
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    listenerType: {
      type: String,
      default: 'tcp',
    },
    listenerZoneOptions: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    lang() {
      return this.$store.state.lang
    },
    recordConfig() {
      return this.record.configs
    },
  },

  watch: {
    record: {
      deep: true,
      immediate: true,
      handler: 'handleRecordChange',
    },
    showMoreItems(val) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (val) {
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop
          document.body.scrollTop = scrollTop
        }, 2)
      }
    },
    disabled(val) {
      this.selfDisabled = val
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData() {
      this.loadConfigParams()
        .then((res) => {
          if (res) {
            this.loadConfig()
          }
        })
        .catch()
    },
    async loadConfigParams() {
      // listener
      if (this.from === 'listener') {
        const resVal = this.loadConfigOptions()
          .then((res) => {
            return res
          })
          .catch()
        return resVal
      }
      // zone
      const data = await loadZoneConfig()
      Object.keys(data).forEach((key) => {
        data[key].description = data[key].description[this.lang]
      })
      this.configData = renderParamsForm(data, 'configs')
      return this.configData
    },
    async loadConfigOptions() {
      const { zone, ...listeners } = await loadConfigSpec()
      // listeners: { ws: {}, tcp: {}, ... }
      Object.keys(listeners).forEach((type) => {
        const diffTypeConfig = listeners[type]
        Object.keys(diffTypeConfig).forEach((key) => {
          diffTypeConfig[key].description = diffTypeConfig[key].description[this.lang]
        })
        if (type === 'tcp') {
          this.configData = renderParamsForm(diffTypeConfig, 'configs')
          this.configOptions[type] = {}
        } else {
          this.configOptions[type] = renderParamsForm(diffTypeConfig, 'configs')
        }
      })
      // wss: ssl+tcp+ws
      const { ...sslConfigs } = this.configOptions.ssl
      const { ...wsConfigs } = this.configOptions.ws
      this.configOptions.wss = {
        form: wsConfigs.form.concat(sslConfigs.form),
        rules: Object.assign(sslConfigs.rules, wsConfigs.rules),
      }
      return this.configOptions
    },
    handleRecordChange(val) {
      if (_.isEqual(val, this.originRecord)) {
        this.selfDisabled = true
        this.$emit('updateDisabled', this.selfDisabled)
        return
      }
      this.selfDisabled = false
      this.$emit('updateDisabled', this.selfDisabled)
    },
    sortKeyName(valOne, valTwo) {
      const resA = valOne.key
      const resB = valTwo.key
      if (resA < resB) {
        return -1
      }
      if (resA === resB) {
        return 0
      }
      return 1
    },
    loadConfig() {
      this.initData()
      if (this.oper === 'edit') {
        delete this.record.name
        delete this.originRecord.name
        this.assignEditData()
      }
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
    assignEditData() {
      const { ...editConfig } = this.editConfig
      Object.keys(editConfig).forEach((key) => {
        if (editConfig[key] === 'null' || editConfig[key] === null) {
          editConfig[key] = ''
          this.nullKeys.push(key)
        }
        this.record.configs[key] = editConfig[key]
        this.originRecord.configs[key] = editConfig[key]
      })
      setTimeout(() => {
        this.configList.forEach((item) => {
          if (this.nullKeys.indexOf(item.key) !== -1) {
            this.nullKeyConfigList.push(item)
          } else {
            this.hasValKeyConfigList.push(item)
          }
        })
        this.hasValKeyConfigList =
          this.from === 'listener'
            ? this.hasValKeyConfigList
            : this.hasValKeyConfigList.sort(this.sortKeyName)
        this.nullKeyConfigList =
          this.from === 'listener'
            ? this.nullKeyConfigList
            : this.nullKeyConfigList.sort(this.sortKeyName)
        this.showConfigList = this.hasValKeyConfigList
      }, 50)
    },
    initData() {
      if (this.from === 'zone') {
        // zone
        delete this.record.type
        delete this.originRecord.type
        this.initConfigs(this.configData)
      } else {
        // listener
        this.record.type = this.listenerType
        this.originRecord.type = this.listenerType
        this.addConfigsAccordingType(this.listenerType)
      }
    },
    initConfigs(configs) {
      const { form, rules } = configs
      this.configList = this.from === 'listener' ? form : form.sort(this.sortKeyName)
      this.showConfigList = [...this.configList]
      this.rules.configs = rules
      if (this.from === 'listener') {
        const verifyListenerArr = [{ required: true, validator: verifyListener }]
        this.rules.configs.listener = verifyListenerArr
      }
      this.record.configs = {}
      this.originRecord.configs = {}
      form.forEach(({ key, value }) => {
        const val = typeof value === 'boolean' ? value.toString() : value
        this.$set(this.record.configs, key, val)
        this.$set(this.originRecord.configs, key, val)
      })
    },
    addConfigsAccordingType(type) {
      // listener的configData拿到的数据是 { ws: { form: {} , rules: {} }, tcp: { form: {} , rules: {} } }
      const { form, rules } = this.configData
      const { ...typeConfigs } = this.configOptions[type]
      const commonRules = { ...rules }
      const totalConfigs = {
        form: typeConfigs.form ? form.concat(typeConfigs.form) : form,
        rules: typeConfigs.rules ? Object.assign(commonRules, typeConfigs.rules) : rules,
      }
      this.initConfigs(totalConfigs)
      this.record.type = type
    },
    toggleRecords() {
      this.showMoreItems = !this.showMoreItems
      const [...hasValKeyConfigList] = this.hasValKeyConfigList
      const [...nullKeyConfigList] = this.nullKeyConfigList
      if (this.showMoreItems) {
        this.showConfigList = hasValKeyConfigList.concat(nullKeyConfigList)
      } else {
        this.showConfigList = this.hasValKeyConfigList
      }
    },
    cancel(needPrompt = true) {
      const confirmCancel = () => {
        setTimeout(() => {
          this.selfDisabled = true
          const { ...config } = this.originRecord.configs
          this.record.configs = config
          if (this.oper === 'add') {
            this.record.name = ''
            if (this.$refs.record) {
              setTimeout(this.$refs.record.clearValidate, 10)
            }
          }
          this.$emit('updateDisabled', this.selfDisabled)
        }, 500)
      }
      if (needPrompt) {
        this.$confirm(this.$t('Settings.cancelConfirm'), this.$t('Base.warning'), {
          type: 'warning',
          cancelButtonText: this.$t('Settings.no'),
        })
          .then(() => {
            confirmCancel()
          })
          .catch(() => {})
      } else {
        confirmCancel()
      }
    },
    async save() {
      const valid = await this.$refs.record.validate()
      if (!valid) {
        this.showMoreItems = true
        return
      }
      this.showMoreItems = false
      const { ...record } = this.recordConfig
      const { name, type } = this.record
      Object.keys(record).forEach((item) => {
        if (record[item] === '') {
          record[item] = 'null'
        }
      })
      this.$emit('update', name, record, type)
    },
  },
}
</script>

<style lang="scss">
.config-detail {
  .no-form-margin {
    margin-top: 0;
  }
  .form-margin {
    margin-top: 32px;
  }
  .show-more {
    text-align: center;
    span {
      display: inline-block;
      margin-right: 55px;
    }
    a {
      display: inline-block;
      width: 100%;
      position: relative;
      text-decoration: none;
      margin-top: 10px;
    }
    a::before {
      content: '';
      position: absolute;
      left: 0px;
      top: 8px;
      z-index: 9;
      width: 44%;
      height: 1px;
      background-color: #edeef2;
    }
    a::after {
      content: '';
      position: absolute;
      right: 0px;
      top: 8px;
      z-index: 9;
      width: 49%;
      height: 1px;
      background-color: #edeef2;
    }
  }
}
</style>
