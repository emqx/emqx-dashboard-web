<template>
  <el-row :gutter="20" class="config-form">
    <el-form
      ref="record"
      class="basic-config-form"
      size="small"
      label-suffix=":"
      label-width="225px"
      label-position="left"
      :model="recordConfig"
      :rules="rules"
    >
      <div v-for="(key, index) in showKeyList" :key="index">
        <el-col :span="12">
          <el-form-item :label="key" :prop="key">
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
        <el-col :span="12" class="form-item-desc">
          {{ $t(`Settings.${key}`) }}
        </el-col>
      </div>
    </el-form>
    <el-col v-if="recordKeys['nullKeyList'].length" :span="24" class="show-more">
      <a href="javascript:;" @click="toggleRecords">
        {{ showMoreItems ? $t('Clients.collapse') : $t('Clients.expand') }}
        <i :class="showMoreItems ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </a>
    </el-col>

    <el-col class="button-group__center" :span="24">
      <el-button plain :disabled="disabled" type="default" size="medium" @click="cancel">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button :loading="btnLoading" type="primary" size="medium" @click="save">
        {{ $t('Base.apply') }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ConfigForm',

  props: {
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
  },

  data() {
    return {
      deepRecord: JSON.parse(JSON.stringify(this.record)),
      showMoreItems: false,
      showKeyList: [],
      recordConfig: {},
      disabled: false,
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
  },

  created() {
    this.initData()
  },

  methods: {
    handleRecordChange(val, oldVal) {
      if (!oldVal || JSON.stringify(oldVal) === '{}') {
        this.disabled = true
        return
      }
      this.disabled = false
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
          this.disabled = true
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
        return
      }
      const { ...record } = this.record
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
