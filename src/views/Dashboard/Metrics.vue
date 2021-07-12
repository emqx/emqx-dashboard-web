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
      <el-col :span="8">
        <el-table :data="metricsObj[currentNode] | filterMetrics('client')" height="280">
          <el-table-column prop="m" :label="$t('Dashboard.client')"> </el-table-column>
          <el-table-column prop="v" sortable> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-table :data="metricsObj[currentNode] | filterMetrics('delivery')" height="280">
          <el-table-column prop="m" label="Delivery"> </el-table-column>
          <el-table-column prop="v" sortable> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-table :data="metricsObj[currentNode] | filterMetrics('session')" height="280">
          <el-table-column prop="m" :label="$t('Dashboard.session')"> </el-table-column>
          <el-table-column prop="v" sortable> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-table :data="metricsObj[currentNode] | filterMetrics('packets')" height="280">
          <el-table-column prop="m" :label="$t('Dashboard.mqttPackages')"> </el-table-column>
          <el-table-column prop="v" sortable> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-table :data="metricsObj[currentNode] | filterMetrics('messages')" height="280">
          <el-table-column prop="m" :label="$t('Dashboard.messageNumber')"> </el-table-column>
          <el-table-column prop="v" sortable> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-table :data="metricsObj[currentNode] | filterMetrics('bytes')" height="280">
          <el-table-column prop="m" :label="$t('Dashboard.traffic')"> </el-table-column>
          <el-table-column prop="v" sortable> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { loadMetrics } from '@/api/common'
import EmqSelect from '../../components/EmqSelect.vue'
export default defineComponent({
  components: { EmqSelect },
  name: 'Metrics',

  setup() {
    let metrics = ref([])
    let metricsObj = ref({})
    let currentNode = ref('')
    let currentNodeIndex = ref(0)

    const translate = function (key, collection = 'Dashboard') {
      return this.$t(collection + '.' + key)
    }

    const metricsData = async () => {
      metrics.value = await loadMetrics().catch(() => {})
      if (metrics.value.length) {
        currentNode.value = metrics.value[0].node
        metrics.value.forEach((v) => {
          metricsObj.value[v.node] = v.metrics
        })
      }
    }

    onMounted(metricsData)

    return {
      tl: translate,
      metrics,
      metricsObj,
      currentNode,
      currentNodeIndex,
    }
  },
  methods: {
    changeNode(n) {
      this.currentNode = n
    },
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
</style>
