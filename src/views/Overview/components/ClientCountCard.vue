<template>
  <a-card class="client-count-card app-card" :loading="overviewLoading || isDataLoading">
    <div class="app-card-title">{{ $t('Overview.recentActiveClients') }}</div>
    <div class="content">
      <div class="count-item">
        <span>
          {{ formatNumber(countElect) }}
        </span>
        <p class="number-label">{{ $t('Overview.electricVehicles') }}</p>
      </div>
      <div class="count-item">
        <span>
          {{ formatNumber(countGas) }}
        </span>
        <p class="number-label">{{ $t('Overview.fuelVehicles') }}</p>
      </div>
    </div>
    <div class="app-footer">
      <el-button v-if="status === STOPPED" size="mini" type="primary" @click="changeStatus(START)">
        {{ $t('Overview.startCounter') }}
      </el-button>
      <el-button v-else-if="status === STARTED" size="mini" type="danger" plain @click="changeStatus(STOP)">
        {{ $t('Overview.pauseCounter') }}
      </el-button>
    </div>
  </a-card>
</template>

<script>
import { getClientCount, getClientCounterStatus, setClientCounterStatus } from '@/api/overview'

const STOPPED = 'stopped'
const STOP = 'stop'
const STARTED = 'started'
const START = 'start'

export default {
  name: 'ClientCountCard',
  props: {
    overviewLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      STOPPED,
      STOP,
      STARTED,
      START,
      isDataLoading: false,
      countElect: 0,
      countGas: 0,
      status: STARTED,
    }
  },
  methods: {
    async getCount() {
      try {
        const { count_1883, count_11883 } = await getClientCount()
        this.countElect = count_1883
        this.countGas = count_11883
      } catch (error) {
        //
      }
    },
    async getStatus() {
      try {
        const { status } = await getClientCounterStatus()
        this.status = status
      } catch (error) {
        //
      }
    },
    async changeStatus(status) {
      try {
        await setClientCounterStatus(status)
        this.getStatus()
      } catch (error) {
        //
      }
    },
    formatNumber(num) {
      const ret = new Intl.NumberFormat().format(num)
      return ret === 'NaN' ? '' : ret
    },
  },
  async mounted() {
    try {
      this.isDataLoading = true
      await Promise.all([this.getCount(), this.getStatus()])
    } catch (error) {
      //
    } finally {
      this.isDataLoading = false
    }
  },
}
</script>

<style lang="scss">
.client-count-card {
  .count-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    span {
      font-size: 20px;
    }
    p {
      margin-bottom: 0;
      font-size: 12px;
      line-height: 1.2;
      flex-basis: 92px;
      text-align: right;
    }
  }
  .number-label {
    font-size: 14px;
    color: #bcbcbc;
  }
}
</style>
