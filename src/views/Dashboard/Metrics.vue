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
    <el-card shadow="never">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-table :data="metricsObj[currentNode] | filterMetrics('client')">
            <el-table-column prop="m"> </el-table-column>
            <el-table-column prop="v"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :data="metricsObj[currentNode] | filterMetrics('delivery')">
            <el-table-column prop="m"> </el-table-column>
            <el-table-column prop="v"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :data="metricsObj[currentNode] | filterMetrics('session')">
            <el-table-column prop="m"> </el-table-column>
            <el-table-column prop="v"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-table :data="metricsObj[currentNode] | filterMetrics('packets')">
            <el-table-column prop="m"> </el-table-column>
            <el-table-column prop="v"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :data="metricsObj[currentNode] | filterMetrics('messages')">
            <el-table-column prop="m"> </el-table-column>
            <el-table-column prop="v"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table :data="metricsObj[currentNode] | filterMetrics('bytes')">
            <el-table-column prop="m"> </el-table-column>
            <el-table-column prop="v"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { loadMetrics } from '@/api/common'
import EmqSelect from '../../components/EmqSelect.vue'
export default defineComponent({
  components: { EmqSelect },
  name: 'Metrics',
  // data() {
  //   return {
  //     metrics: [],
  //   }
  // },
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
      // console.log(metricsObj.value, metrics.value)
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
      // console.log(keys)

      return keys
    },
  },
})
</script>
<style scoped></style>
