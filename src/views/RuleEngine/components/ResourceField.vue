<template>
  <el-row :gutter="40" class="resource-field">
    <ul class="field-info">
      <el-col v-for="(item, i) in configList" :key="i" :span="12">
        <li v-if="item.value.filename !== ''" class="field-info-item" :title="item.description">
          <div class="field-title">{{ item.title }}:</div>
          <span class="field-value">
            <span :class="{ 'field-password': showPwdIndex !== i && item.key === 'password' }">
              {{ item.value | itemValue({ i, key: item.key, showPwdIndex }) }}
            </span>
            <span
              v-if="item.key === 'password' && item.value"
              :class="['el-icon-view', showPwdIndex === i ? 'active' : '']"
              @click="togglePassword(i)"
            ></span>
          </span>
        </li>
      </el-col>
    </ul>
  </el-row>
</template>

<script>
export default {
  name: 'ResourceField',

  components: {},

  filters: {
    itemValue(val, params) {
      const { i, key, showPwdIndex } = params
      if (typeof val === 'object') {
        const { filename } = val
        const data = !filename ? JSON.stringify(val) : filename
        return data
      }
      if (val && key === 'password' && showPwdIndex !== i) {
        return '**********'
      }
      return val
    },
  },

  props: {
    config: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      showPwdIndex: -1,
    }
  },

  computed: {
    configList() {
      // Show or hide certain items based on the value of ssl/https_enabled
      const dependentList = this.config.filter((item) => item.key === 'ssl' || item.key === 'https_enabled')
      if (dependentList.length > 0 && !dependentList[0].value) {
        // hide
        return this.config.filter((item) => !['verify', 'tls_version'].includes(item.key))
      }
      // show
      return this.config
    },
  },

  methods: {
    togglePassword(i) {
      this.showPwdIndex = this.showPwdIndex === i ? -1 : i
    },
  },
}
</script>

<style lang="scss">
.resource-field {
  .field-info-item {
    display: flex;

    .field-title {
      width: unset;
      flex-shrink: 0;
    }

    .field-value {
      word-break: break-all;
      .field-password {
        vertical-align: middle;
        line-height: 17px;
      }

      .el-icon-view {
        margin-left: 5px;
        cursor: pointer;
        color: #a2a2a2;
        &:hover {
          color: #34c388;
        }
      }

      .active {
        color: #34c388;
      }
    }
  }
}
</style>
