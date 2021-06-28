<template>
  <div class="percentage-cards">
    <el-row :gutter="20">
      <div v-for="(item, index) in doughnutChartList" :key="index">
        <el-col :span="8">
          <el-card shadow="never" class="doughnut-card">
            <doughnut-chart
              :chartId="item.chartId"
              :cardTitle="item.cardTitle"
              :legendData="item.legendData"
              :seriesData="item.seriesData"
            ></doughnut-chart>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import DoughnutChart from './DoughnutChart'
import { loadAllMetrics } from '@/api/dashboard'

export default {
  name: 'PercentageCards',

  components: {
    DoughnutChart,
  },

  data() {
    return {
      doughnutChartList: [
        {
          chartId: 'client',
          cardTitle: this.$t('Clients.clients'),
          legendData: [
            this.$t('Clients.authSuccess'),
            this.$t('Clients.authFailed'),
            this.$t('Clients.connectSuccess'),
          ],
          seriesData: [
            {
              value: 0,
              name: this.$t('Clients.authSuccess'),
              itemStyle: { color: '#21BB7A' },
            },
            {
              value: 0,
              name: this.$t('Clients.authFailed'),
              itemStyle: { color: '#FFC600' },
            },
            {
              value: 0,
              name: this.$t('Clients.connectSuccess'),
              itemStyle: { color: '#3237A9' },
            },
          ],
        },
        {
          chartId: 'message',
          cardTitle: this.$t('Overview.message'),
          legendData: [
            this.$t('Overview.receivedMsg'),
            this.$t('Overview.sentMsg'),
            this.$t('Overview.droppedMsg'),
          ],
          seriesData: [
            {
              value: 0,
              name: this.$t('Overview.receivedMsg'),
              itemStyle: { color: '#CAEADE' },
            },
            {
              value: 0,
              name: this.$t('Overview.sentMsg'),
              itemStyle: { color: '#35BFDE' },
            },
            {
              value: 0,
              name: this.$t('Overview.droppedMsg'),
              itemStyle: { color: '#3E32E2' },
            },
          ],
        },
        {
          chartId: 'messageDrop',
          cardTitle: this.$t('Overview.messageDrop'),
          legendData: [this.$t('Overview.expired'), this.$t('Overview.noSubscribers')],
          seriesData: [
            {
              value: 0,
              name: this.$t('Overview.expired'),
              itemStyle: { color: '#CDBFFA' },
            },
            {
              value: 0,
              name: this.$t('Overview.noSubscribers'),
              itemStyle: { color: '#383F65' },
            },
          ],
        },
      ],
    }
  },

  created() {
    this.loadMetricsData()
  },

  methods: {
    async loadMetricsData() {
      const res = await loadAllMetrics()
      this.doughnutChartList.forEach((item) => {
        item.seriesData.forEach((one) => {
          const index = item.seriesData.indexOf(one)
          const data = res[item.chartId]
          const dataKeys = Object.keys(data)
          one.value = data[dataKeys[index]]
        })
      })
    },
  },
}
</script>

<style lang="scss">
// @import '../../../assets/style/variables';

.percentage-cards {
  margin-top: 20px;

  .doughnut-card {
    // @include trans-up-mixin(-1px);
    border-radius: 8px;
    height: 255px;
  }
}
</style>
