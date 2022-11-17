<template>
  <el-row :gutter="24" class="config-form">
    <el-form
      ref="record"
      class="basic-config-form"
      size="small"
      :label-width="labelWidth"
      label-position="left"
      :model="recordConfig"
      :rules="rules"
    >
      <div v-for="(key, index) in showKeyList" :key="index">
        <el-col :span="14">
          <el-form-item :label="key === '' ? 'listener_on' : key" :prop="key">
            <template slot="label">
              <span v-html="key === '' ? 'listener_on' : key"></span>
            </template>
            <template v-if="deepRecord[key] === 'true' || deepRecord[key] === 'false'">
              <emq-select v-model="recordConfig[key]" :field="{ options: boolOptions }"> </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'allow' || deepRecord[key] === 'deny'">
              <emq-select v-model="recordConfig[key]" :field="{ options: permitOptions }"> </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'ignore' || deepRecord[key] === 'disconnect'">
              <emq-select v-model="recordConfig[key]" :field="{ options: actionOptions }"> </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'on' || deepRecord[key] === 'off'">
              <emq-select v-model="recordConfig[key]" :field="{ options: enableOptions }"> </emq-select>
            </template>

            <template v-else-if="deepRecord[key] === 'highest' || deepRecord[key] === 'lowest'">
              <emq-select v-model="recordConfig[key]" :field="{ options: priorityOptions }"> </emq-select>
            </template>

            <template v-else-if="key === 'max_qos_allowed' || key === 'mqtt_max_qos_allowed'">
              <emq-select v-model="recordConfig[key]" :field="{ options: qosOptions }"> </emq-select>
            </template>

            <template v-else>
              <el-input v-model="recordConfig[key]" class="form-item-input" :placeholder="recordConfig[key]">
              </el-input>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="form-item-desc">
          <span v-if="key !== ''">{{ $t(`Settings.${key}`) }}</span>
          <span v-else>{{ $t(`Settings.listener_on`) }}</span>
        </el-col>
      </div>
    </el-form>
    <el-col v-if="recordKeys['nullKeyList'].length" :span="24" class="show-more">
      <a href="javascript:;" @click="toggleRecords">
        {{ showMoreItems ? $t('Clients.collapse') : $t('Clients.expand') }}
        <i :class="showMoreItems ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </a>
    </el-col>

    <el-col class="button-group__center" :span="12">
      <el-button plain :disabled="selfDisabled" type="default" size="medium" @click="cancel">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button :disabled="selfDisabled" :loading="btnLoading" type="primary" size="medium" @click="save">
        {{ $t('Base.apply') }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ConfigForm',

  model: {
    prop: 'disabled',
    event: 'updateDisabled',
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Object,
      requried: true,
      default: () => ({}),
    },
    rules: {
      type: Object,
      requried: true,
      default: () => ({}),
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    boolOptions: {
      type: Array,
      default: () => [],
    },
    permitOptions: {
      type: Array,
      default: () => [],
    },
    actionOptions: {
      type: Array,
      default: () => [],
    },
    enableOptions: {
      type: Array,
      default: () => [],
    },
    priorityOptions: {
      type: Array,
      default: () => [],
    },
    qosOptions: {
      type: Array,
      default: () => [],
    },
    labelWidth: {
      type: String,
      default: '225px',
    },
  },

  data() {
    return {
      deepRecord: JSON.parse(JSON.stringify(this.record)),
      showMoreItems: false,
      showKeyList: [],
      recordConfig: {},
      selfDisabled: false,
    }
  },

  computed: {
    recordKeys() {
      let keysObj = {}
      const keyList = []
      const nullKeyList = []
      Object.keys(this.record).forEach((key) => {
        if (this.record[key] !== 'null') {
          keyList.push(key)
        } else {
          nullKeyList.push(key)
        }
      })
      keysObj = {
        keyList: keyList.sort(),
        nullKeyList: nullKeyList.sort(),
      }
      return keysObj
    },
  },

  watch: {
    recordConfig: {
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
    disabled(val) {
      this.selfDisabled = val
    },
  },

  created() {
    this.initData()
  },

  methods: {
    handleRecordChange(val, oldVal) {
      if (!oldVal || JSON.stringify(oldVal) === '{}') {
        this.selfDisabled = true
        this.$emit('updateDisabled', this.selfDisabled)
        return
      }
      this.selfDisabled = false
      this.$emit('updateDisabled', this.selfDisabled)
    },
    initData() {
      this.showKeyList = this.recordKeys.keyList
      const { ...record } = this.record
      Object.keys(record).forEach((item) => {
        if (record[item] === 'null') {
          record[item] = ''
        }
      })
      this.recordConfig = record
    },
    toggleRecords() {
      this.showMoreItems = !this.showMoreItems
      if (this.showMoreItems) {
        const { keyList, nullKeyList } = this.recordKeys
        this.showKeyList = keyList.concat(nullKeyList)
      } else {
        this.showKeyList = this.recordKeys.keyList
      }
    },
    cancel(needPrompt = true) {
      const confirmCancel = () => {
        this.initData()
        setTimeout(() => {
          this.selfDisabled = true
          this.$emit('updateDisabled', this.selfDisabled)
        }, 500)
      }
      if (needPrompt) {
        this.$confirm(this.$t('General.cancelConfirm'), {
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
      Object.keys(record).forEach((item) => {
        if (record[item] === '') {
          record[item] = 'null'
        }
      })
      this.$emit('update', record)
    },
  },
}
</script>

<style lang="scss">
.config-form {
  .el-form-item__label {
    display: flex;
    height: 32px;
    align-items: center;
    word-break: break-all;
    line-height: 1.2;
    &::after {
      content: ':';
      position: relative;
      right: -2px;
      top: 0;
    }
  }
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
  .form-item-input {
    .el-icon-close {
      visibility: hidden;
    }
    &:hover {
      .el-icon-close {
        visibility: visible;
        cursor: pointer;
      }
    }
  }
}
</style>
