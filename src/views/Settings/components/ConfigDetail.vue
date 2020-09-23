<template>
  <div class="config-detail">
    <el-row :gutter="20" class="config-form">
      <el-form
        ref="record"
        class="basic-config-form"
        size="small"
        label-suffix=":"
        label-width="225px"
        label-position="left"
        :model="record"
        :rules="rules"
      >
        <template v-if="showConfigList.length">
          <template v-if="oper === 'add'">
            <el-col :span="12" class="form-item-desc">
              <el-form-item label="name" prop="name">
                <el-input v-model="record['name']"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="form-item-desc">
              <span>{{ $t('Settings.zoneName') }}</span>
            </el-col>
          </template>

          <div v-for="(item, index) in showConfigList" :key="index">
            <el-col :span="12">
              <el-form-item :label="item.key" :prop="item.key">
                <template v-if="item.elType !== 'select'">
                  <el-input
                    v-if="item.type === 'number'"
                    v-model.number="record.configs[item.key]"
                    v-bind="item.bindAttributes"
                  >
                  </el-input>
                  <el-input v-else v-model="record.configs[item.key]" v-bind="item.bindAttributes"> </el-input>
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
              </el-form-item>
            </el-col>
            <el-col :span="12" class="form-item-desc">
              <span>{{ item.formItemAttributes.description }}</span>
            </el-col>
          </div>
        </template>
        <template v-else>
          <a-skeleton active></a-skeleton>
        </template>
      </el-form>
      <el-col v-if="nullKeys.length" :span="24" class="show-more">
        <a href="javascript:;" @click="toggleRecords">
          {{ showMoreItems ? $t('Clients.collapse') : $t('Clients.expand') }}
          <i :class="showMoreItems ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </a>
      </el-col>
      <el-col class="button-group__center" :span="24">
        <el-button plain :disabled="selfDisabled" type="default" size="medium" @click="cancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button :loading="btnLoading" type="primary" size="medium" @click="save">
          <span v-if="oper === 'add'">{{ $t('Base.add') }}</span>
          <span v-else>{{ $t('Base.apply') }}</span>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
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
        name: [{ required: true, message: this.$t('Settings.zoneNameTip') }],
      },
      record: {
        configs: {},
        name: '',
      },
      originRecord: {
        configs: {},
        name: '',
      },
      selfDisabled: false,
      showMoreItems: false,
    }
  },

  props: {
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
    configData: {
      type: Object,
      default: () => {},
    },
    btnLoading: {
      type: Boolean,
      default: false,
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
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (val) {
        setTimeout(() => {
          document.documentElement.scrollTop = scrollTop
          document.body.scrollTop = scrollTop
        }, 2)
      }
    },
  },

  created() {
    setTimeout(() => {
      this.loadConfig()
    }, 80)
  },

  methods: {
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
    async loadConfig() {
      const { form, rules } = this.configData
      this.configList = form.sort(this.sortKeyName)
      this.showConfigList = form.sort(this.sortKeyName)
      this.rules.configs = rules
      form.forEach(({ key, value }) => {
        const val = typeof value === 'boolean' ? value.toString() : value
        this.$set(this.record.configs, key, val)
        this.$set(this.originRecord.configs, key, val)
      })
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
        this.showConfigList = this.hasValKeyConfigList.sort(this.sortKeyName)
      }, 50)
    },
    toggleRecords() {
      this.showMoreItems = !this.showMoreItems
      const [...hasValKeyConfigList] = this.hasValKeyConfigList
      const [...nullKeyConfigList] = this.nullKeyConfigList
      if (this.showMoreItems) {
        this.showConfigList = hasValKeyConfigList
          .sort(this.sortKeyName)
          .concat(nullKeyConfigList.sort(this.sortKeyName))
      } else {
        this.showConfigList = this.hasValKeyConfigList.sort(this.sortKeyName)
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
      const { name } = this.record
      Object.keys(record).forEach((item) => {
        if (record[item] === '') {
          record[item] = 'null'
        }
      })
      this.$emit('update', name, record)
    },
  },
}
</script>

<style lang="scss">
.config-detail {
  .show-more {
    text-align: center;
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
      width: 46%;
      height: 1px;
      background-color: #edeef2;
    }
    a::after {
      content: '';
      position: absolute;
      right: 0px;
      top: 8px;
      z-index: 9;
      width: 46%;
      height: 1px;
      background-color: #edeef2;
    }
  }
}
</style>
