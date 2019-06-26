<template>
  <el-select
    :value="rawValue"
    v-bind="$attrs"
    class="emq-select"
    v-on="$listeners"
  >
    <slot>
      <el-option
        v-for="(item, i) in options" :key="i"
        :value="item.value"
        :label="item.label"
        :disabled="isDisabled(item)"
      >
        <slot name="option" :item="item"></slot>
      </el-option>
    </slot>
  </el-select>
</template>


<script>
import http from '@/common/http'

export default {
  name: 'EmqSelect',

  components: {},

  props: {
    value: {},
    field: {
      type: Object,
      required: true,
    },
    disabledItem: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      options: [],
    }
  },

  computed: {
    rawValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      },
    },
  },

  async created() {
    this.options = await this.getOptions()
  },

  methods: {
    isDisabled(item) {
      return this.disabledItem.includes(item.value)
    },
    async getOptions() {
      const {
        api, url, options, list,
      } = this.field
      let value = []
      if (options) {
        value = options
      } else if (list) {
        value = list.map($ => ({ label: $, value: $ }))
      } else if (api) {
        value = await api()
      } else if (url) {
        value = await http.get(url)
      }
      return value
    },
  },
}
</script>
