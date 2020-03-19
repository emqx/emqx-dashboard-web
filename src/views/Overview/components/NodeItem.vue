<template>
  <div class="node-item">
    <div
      v-for="(item, i) in nodes"
      :key="i" class="item"
      :class="{ active: rawValue === item.node }"
      @click="atClick(item)"
    >
      {{ item.node }}
    </div>
  </div>
</template>


<script>
import { loadNodes } from '@/api/common'

export default {
  name: 'NodeItem',

  components: {},

  props: {
    value: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
    defaultSelect: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      nodes: [],
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

  created() {
    this.loadData()
  },

  methods: {
    atClick(item) {
      this.rawValue = item.node
    },
    async loadData() {
      if (this.list && this.list.length > 0) {
        this.nodes = this.list
      } else {
        this.nodes = await loadNodes()
      }
      if (this.defaultSelect && !this.value) {
        this.rawValue = (this.nodes[0] || {}).node
      }
    },
  },
}
</script>


<style lang="scss">
.node-item {
  padding: 16px;

  .item {
    padding: 2px 0 2px 12px;
    transition: all .3s;
    cursor: pointer;
    border-left: 3px solid #fff;

    &:hover, &.active {
      border-left: 3px solid #34C388;
    }
  }
}
</style>
