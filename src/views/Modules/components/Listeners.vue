<template>
  <div class="listeners">
    <div v-for="(item, index) in showItemList" :key="index" class="listener-item">
      <div class="listener-item-head">
        <div class="listener-item-type" v-for="(key, i) in Object.keys(item)" :key="i">
          <div class="title">{{ $t(`Modules.${key}`) }}</div>
          <div class="desc">{{ item[key] }}</div>
        </div>
        <div class="listener-item-btn">
          <span class="btn" @click="editListener(index)">
            {{ $t('Base.edit') }}
          </span>
          <span class="btn" @click="removeListener(index)">
            {{ $t('Modules.remove') }}
          </span>
        </div>
      </div>
    </div>

    <el-button size="small" icon="el-icon-plus" @click="addListener">
      {{ $t('Modules.addListener') }}
    </el-button>

    <el-dialog @open="loadConfigList" :visible.sync="listenerDialogVisible" :title="listenerDialogTitle" width="520px">
      <el-form ref="record" :model="record" :rules="rules" size="small" label-position="top">
        <el-row class="config-item-wrapper" :gutter="20">
          <template v-if="showConfigList.length > 0">
            <div v-for="(item, i) in showConfigList" :key="i">
              <el-col :span="item.type === 'textarea' || item.type === 'object' ? 24 : 12">
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
                  <template v-else-if="item.elType === 'file'">
                    <file-editor v-model="record.config[item.key]"></file-editor>
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
              </el-col>
            </div>
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
  </div>
</template>

<script>
import { renderParamsForm, verifyListener } from '@/common/utils'
import KeyAndValueEditor from '@/components/KeyAndValueEditor'
import FileEditor from '@/components/FileEditor'

export default {
  name: 'Listeners',

  components: {
    KeyAndValueEditor,
    FileEditor,
  },

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
    listenerData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      listenerDialogTitle: this.$t('Modules.addListener'),
      listenerDialogVisible: false,
      record: {
        config: {},
      },
      rules: {
        config: {},
      },
      showConfigList: [],
      commonConfigs: [],
      commonRules: {
        config: {},
      },
      commonRecord: {
        config: {},
      },
      optionConfig: {},
      configLoading: false,
      showItemList: [],
      listenerList: [],
      currentOper: '',
      selectedListener: {},
      currentEditIndex: 0,
    }
  },

  computed: {
    listener_type() {
      return this.record.config.listener_type
    },
  },

  watch: {
    listener_type(val) {
      this.addDataAccordingListenerType(val)
    },
  },

  created() {
    if (this.value.length) {
      this.listenerList = this.value
      this.value.forEach((item) => {
        const { listen_on, listener_type, acceptors, active_n, max_conn_rate, max_connections } = item
        this.showItemList.push({ listen_on, listener_type, acceptors, active_n, max_conn_rate, max_connections })
      })
    }
  },

  methods: {
    addDataAccordingListenerType(type) {
      const keyName = `${type}_options`
      const { form, rules } = this.optionConfig[keyName]
      const [...commonList] = this.commonConfigs
      const { ...commonRulesConfig } = this.commonRules.config
      const { ...commonRecordConfig } = this.commonRecord.config

      // 公共的form拼接监听类型对应的form
      this.showConfigList = commonList.concat(form)
      const optionRecordConfig = {}
      form.forEach(({ key, value }) => {
        this.$set(optionRecordConfig, key, value)
      })
      this.record.config = Object.assign(commonRecordConfig, optionRecordConfig)
      this.rules.config = Object.assign(commonRulesConfig, rules)
      const verifyListenerArr = [{ required: true, validator: verifyListener }]
      this.rules.config.listen_on = verifyListenerArr
      if (this.currentOper === 'edit') {
        Object.assign(this.record.config, this.selectedListener)
      }
      this.record.config.listener_type = type
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
    cleanOldData() {
      this.commonConfigs = []
      this.commonRules.config = {}
      this.rules.config = {}
      this.optionConfig = {}
      this.record.config = {}
      this.showConfigList = []
    },
    loadConfigList() {
      this.cleanOldData()
      this.configLoading = true
      const { ...allData } = this.listenerData
      Object.keys(allData).forEach((item) => {
        allData[item] = renderParamsForm(allData[item], 'config')
        if (!item.includes('options')) {
          const { form, rules } = allData[item]
          // 上面的基础配置
          this.commonConfigs = this.commonConfigs.concat(form)
          this.commonRules.config = Object.assign(this.commonRules.config, rules)
        } else {
          // 与监听类型关联的配置
          this.optionConfig[item] = allData[item]
        }
      })
      this.commonRecord.config = {}
      this.commonConfigs.forEach(({ key, value }) => {
        this.$set(this.commonRecord.config, key, value)
      })
      this.showConfigList = this.commonConfigs
      this.record = { ...this.commonRecord }

      if (this.currentOper === 'add') {
        this.addDataAccordingListenerType(this.commonRecord.config.listener_type)
      } else {
        this.addDataAccordingListenerType(this.selectedListener.listener_type)
      }
      this.configLoading = false
      if (this.$refs.record) {
        setTimeout(this.$refs.record.clearValidate, 10)
      }
    },
    atDialogClose() {
      setTimeout(() => {
        this.$refs.record.clearValidate()
        this.listenerDialogVisible = false
      }, 10)
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

      const { listen_on, listener_type, acceptors, active_n, max_conn_rate, max_connections } = config
      if (this.currentOper === 'add') {
        this.showItemList.push({ listen_on, listener_type, acceptors, active_n, max_conn_rate, max_connections })
        this.listenerList.push(config)
      } else {
        const tempObj = { listen_on, listener_type, acceptors, active_n, max_conn_rate, max_connections }
        this.listenerList.splice(this.currentEditIndex, 1, config)
        this.showItemList.splice(this.currentEditIndex, 1, tempObj)
      }
      this.$emit('update', this.listenerList)
      this.atDialogClose()
    },
    handleCancel() {
      this.atDialogClose()
    },
    addListener() {
      this.currentOper = 'add'
      this.listenerDialogTitle = this.$t('Modules.addListener')
      this.listenerDialogVisible = true
    },
    editListener(index) {
      this.currentOper = 'edit'
      this.currentEditIndex = index
      this.listenerDialogTitle = this.$t('Modules.editListener')
      this.selectedListener = { ...this.listenerList[index] }
      this.listenerDialogVisible = true
    },
    removeListener(index) {
      this.showItemList.splice(index, 1)
      this.listenerList.splice(index, 1)
      this.$emit('update', this.listenerList)
    },
  },
}
</script>

<style lang="scss">
.listeners {
  .listener-item {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f2f2f2;
    border: 1px dashed #f2f2f2;
    transition: border 0.3s;
    position: relative;
    border-radius: 4px;

    .listener-item-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;

      .listener-item-type {
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

      .listener-item-btn {
        .btn {
          margin-right: 5px;
          &:last-child {
            margin-right: 0px;
          }
        }
      }
    }
  }
}
</style>
