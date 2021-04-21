<template>
  <ul class="resources-node">
    <li v-for="(item, i) in value.status" :key="i">
      <el-badge is-dot :type="item.is_alive ? 'success' : 'danger'"></el-badge>
      <span class="node-name">{{ item.node }}</span>
      <el-button
        v-if="!item.is_alive"
        type="danger"
        size="mini"
        :loading="item.loading"
        @click="resourceReconnect(item)"
      >
        {{ $t('RuleEngine.reconnect') }}
      </el-button>
    </li>
  </ul>
</template>

<script>
import { reconnectResource } from '@/api/rules'

export default {
  name: 'ResourceNode',

  components: {},

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {}
  },

  created() {},

  methods: {
    resourceReconnect(item) {
      this.$set(item, 'loading', true)
      reconnectResource(this.value.id)
        .then(() => {
          this.$set(item, 'loading', false)
          this.$emit('change', this.value, true)
        })
        .catch(() => {
          this.$set(item, 'loading', false)
        })
    },
  },
}
</script>

<style lang="scss">
.resources-node {
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    padding: 4px 0;
  }

  .el-button {
    margin-left: 12px;
  }
}
</style>
