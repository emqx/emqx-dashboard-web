<template>
  <div class="metrics app-wrapper">
    <div class="section-header">
      <div>
        <span>{{ tl('dataList') }}</span>
        <div class="section-desc">{{ tl('packetStatisticsOfNodes') }}</div>
      </div>
      <div class="section-addition">
        <emq-select
          v-model="currentNode"
          :field="{ options: metrics }"
          :field-name="{ label: 'node', value: 'node' }"
          @change="changeNode"
        ></emq-select>
      </div>
    </div>
    <el-row :gutter="20">
      <el-table
        :data="metricsObj[currentNode] | filterMetrics('client')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('client')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="metricsObj[currentNode] | filterMetrics('delivery')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" label="Delivery"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="metricsObj[currentNode] | filterMetrics('session')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('session')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="metricsObj[currentNode] | filterMetrics('packets')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('mqttPackages')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="metricsObj[currentNode] | filterMetrics('messages')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('messageNumber')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table :data="metricsObj[currentNode] | filterMetrics('bytes')" v-loading.lock="lockTable">
        <el-table-column prop="m" :label="tl('traffic')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { loadMetrics } from '@/api/common'
import EmqSelect from '@/components/EmqSelect.vue'
export default defineComponent({
  components: { EmqSelect },
  name: 'Metrics',

  setup() {
    let metrics = reactive([])
    let metricsObj = reactive({})
    let currentNode = ref('')
    let currentNodeIndex = ref(0)
    let lockTable = ref(true)

    const translate = function (key, collection = 'Dashboard') {
      return this.$t(collection + '.' + key)
    }

    const metricsData = async () => {
      let metricsArr = await loadMetrics().catch(() => {})
      lockTable.value = false
      metricsArr.forEach((v) => {
        metrics.push(v)
      })
      if (metrics.length) {
        currentNode.value = metrics[0].node
        metrics.forEach((v) => {
          metricsObj[v.node] = v
        })
      }
    }

    const changeNode = (n) => {
      this.currentNode = n
    }

    onMounted(metricsData)

    return {
      tl: translate,
      metrics,
      metricsObj,
      currentNode,
      lockTable,
      changeNode,
      currentNodeIndex,
    }
  },
  filters: {
    filterMetrics(data, key) {
      let keys = []
      Object.keys(data || {}).forEach((v) => {
        if (v.startsWith(key)) {
          keys.push({ m: v.split('.').slice(1).join('.'), v: data[v] })
        }
      })
      return keys
    },
  },
})
</script>
<style scoped>
.el-row {
  margin: 40px 0;
}

.el-table:not(:first-child) {
  margin-top: 40px;
}
</style>
