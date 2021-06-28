<template>
  <div class="nodes app-wrapper">
    <div class="section-header">{{ tl('nodeData') }}</div>
    <el-table :data="nodes">
      <el-table-column prop="node" :label="tl('nodeName')" sortable> </el-table-column>
      <el-table-column :label="tl('nodeStatus')" sortable>
        <template #default="{ row }">
          <el-badge
            is-dot
            :type="caseInsensitiveCompare(row.node_status, 'running') ? 'primary' : 'danger'"
          ></el-badge>
          <span
            >{{
              caseInsensitiveCompare(row.node_status, 'running')
                ? $t('Dashboard.running')
                : $t('Dashboard.stopped')
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="tl('version')"> </el-table-column>
      <el-table-column prop="uptime" :label="tl('uptime')"> </el-table-column>
      <el-table-column :label="`Erlang ${tl('process')}`">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.process_used}/${row.process_available}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="calcPercentage(row.process_used, row.process_available)"
            ></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="`CPU ${tl('load')}`">
        <template #default="{ row }"> {{ row.load1 }}/{{ row.load5 }}/{{ row.load15 }} </template>
      </el-table-column>
      <el-table-column :label="tl('memory')">
        <template #default="{ row }"> {{ row.memory_used }}/{{ row.memory_total }} </template>
      </el-table-column>
      <el-table-column :label="tl('maxFds')" prop="max_fds"></el-table-column>
    </el-table>
    <div class="section-header">{{ tl('nodeStatis') }}</div>
    <el-table :data="stats">
      <el-table-column prop="node" :label="tl('nodeName')"> </el-table-column>
      <el-table-column :label="tl('currentConnection')">
        <template #default="{ row }">
          {{ row.stats['connections.count'] }}/{{ row.stats['connections.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('topics')">
        <template #default="{ row }">
          {{ row.stats['topics.count'] }}/{{ row.stats['topics.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('retained')">
        <template #default="{ row }">
          {{ row.stats['retained.count'] }}/{{ row.stats['retained.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('session')">
        <template #default="{ row }">
          {{ row.stats['sessions.count'] }}/{{ row.stats['sessions.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('subscription')">
        <template #default="{ row }">
          {{ row.stats['subscriptions.count'] }}/{{ row.stats['subscriptions.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('shareSubscription')">
        <template #default="{ row }">
          {{ row.stats['subscriptions.shared.count'] }}/{{ row.stats['subscriptions.shared.max'] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { loadNodes, loadStats } from '@/api/common'

export default {
  name: 'Nodes',
  computed: {},
  data: function () {
    return {
      nodes: [],
      stats: [],
    }
  },
  created() {
    this.allNodes()
    this.allStats()
  },
  methods: {
    tl(key, collection = 'Dashboard') {
      return this.$t(collection + '.' + key)
    },
    async allNodes() {
      let nodes = await loadNodes().catch(() => {})
      this.nodes = nodes
      return nodes
    },
    async allStats() {
      let stats = await loadStats().catch(() => {})
      this.stats = stats
      return stats
    },
    caseInsensitiveCompare(w, k) {
      return !!String.prototype.match.call(w, new RegExp(k, 'i'))
    },
    calcPercentage(n1, n2) {
      let p = (+n1 / +n2) * 100
      if (p && p < 1) return 1
      if (!p) return 0
      return p
    },
  },
}
</script>
<style scoped></style>
