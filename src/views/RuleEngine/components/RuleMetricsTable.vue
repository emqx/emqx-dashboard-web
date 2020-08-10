<template>
  <div v-if="showComponent" class="rule-metrics-table">
    <div class="oper-wrapper">
      <div class="ctl-title btn btn-default" @click="toggleShowTable">
        <slot>
          <span>
            {{ showTable ? $t('RuleEngine.foldDetails') : $t('RuleEngine.showDetails') }}
          </span>
          <i :class="showTable ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </slot>
      </div>

      <el-collapse-transition>
        <el-table v-if="showTable" :data="metrics">
          <el-table-column prop="node" :label="$t('RuleEngine.node')"></el-table-column>
          <el-table-column prop="matched" :label="$t('RuleEngine.numberOfHits')"></el-table-column>
          <el-table-column prop="speed" :label="$t('RuleEngine.currentSpeed')"></el-table-column>
          <el-table-column prop="speed_max" :label="$t('RuleEngine.maximumSpeed')"></el-table-column>
          <el-table-column prop="speed_last5m" :label="$t('RuleEngine.last5MinutesSpeed')"></el-table-column>
        </el-table>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuleMetricsTable',

  components: {},

  props: {
    metrics: {
      type: Array,
      default: () => ({}),
    },
  },

  data() {
    return {
      showTable: false,
    }
  },

  computed: {
    showComponent() {
      return this.metrics && this.metrics.length > 0
    },
  },

  created() {},

  methods: {
    toggleShowTable() {
      this.showTable = !this.showTable
    },
  },
}
</script>

<style lang="scss">
.rule-metrics-table {
  .oper-wrapper {
    .ctl-title {
      margin: 10px auto;
      text-align: center;
    }
  }
}
</style>
