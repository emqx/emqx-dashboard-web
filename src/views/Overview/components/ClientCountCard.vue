<template>
  <a-card class="client-count-card app-card" :loading="overviewLoading || isDataLoading">
    <div class="app-card-title">{{ $t('Overview.recentActiveClients') }}</div>
    <div class="content">
      <span>
        {{ formatNumber(count) }}
      </span>
      <div class="flux-wrapper"></div>
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
      count: 0,
      status: STARTED,
    }
  },
  methods: {
    async getCount() {
      try {
        const { count } = await getClientCount()
        this.count = count
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
  .count-bd {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .num {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0;
  }
}
</style>
