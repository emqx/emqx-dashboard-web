<template>
  <a-card class="base-settings emq-list-card">
    <config-form
      v-if="mqttRecord"
      class="base-form"
      ref="mqttForm"
      :record="mqttRecord"
      :rules="rules"
      :btn-loading="saveLoading"
      v-model="disabled"
      v-bind="allOptions"
      labelWidth="280px"
      @update="handleUpdate(...arguments, 'emqx')"
    >
    </config-form>
    <template v-else>
      <a-skeleton active></a-skeleton>
    </template>
  </a-card>
</template>

<script>
import { loadConfig, updateConfig } from '../../api/settings'
import ConfigForm from './components/ConfigForm'
import { allOptions } from '@/common/settingsData'

export default {
  name: 'BaseSettings',

  components: {
    ConfigForm,
  },

  data() {
    return {
      saveLoading: false,
      mqttRecord: null,
      initMqtt: {},
      rules: {},
      disabled: false,
    }
  },

  computed: {
    allOptions() {
      return allOptions
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const { mqttRes } = await loadConfig()
      Object.keys(mqttRes).forEach((key) => {
        this.rules[key] = [{ required: true, message: this.$t('Settings.pleaseEnter') }]
      })
      this.mqttRecord = mqttRes
      // 加载数据重新赋值 init
      Object.assign(this.initMqtt, mqttRes)
    },
    async handleUpdate(data, type) {
      this.saveLoading = true
      const res = await updateConfig(type, data)
      if (res) {
        this.disabled = true
        this.$message.success(this.$t('Base.applySuccess'))
        // 保存成功后赋值到 init 的值
        Object.assign(this.initMqtt, this.mqttRecord)
        this.loadData()
      }
      this.saveLoading = false
    },
  },
}
</script>

<style lang="scss">
.base-settings .base-form {
  .el-form {
    margin-top: 0;
  }
}
</style>
