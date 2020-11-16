<template>
  <el-row :gutter="40" class="resource-field">
    <ul class="field-info">
      <el-col v-for="(item, i) in config" :key="i" :span="12">
        <li
          v-if="item.value.file !== ''"
          class="field-info-item"
          :title="item.value.file ? item.value.file : item.description"
        >
          <div class="field-title">{{ item.title }}:</div>
          <span class="field-value">
            <span v-if="item.key === 'password' && item.value && showPwdIndex !== i" class="field-password">
              ***********
            </span>
            <span v-else>{{ item.value | itemValue }}</span>
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
    itemValue(val) {
      if (typeof val === 'object') {
        const { file } = val
        const data = !file ? JSON.stringify(val) : `${file.slice(0, 31)} ...`
        return data
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

  created() {},

  methods: {
    togglePassword(i) {
      this.showPwdIndex = this.showPwdIndex === i ? -1 : i
    },
  },
}
</script>

<style lang="scss">
.resource-field {
  .field-title {
    width: 140px !important;
  }

  .field-value {
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
</style>
