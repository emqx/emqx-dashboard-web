<template>
  <div class="alarm app-wrapper">
    <div class="section-header">
      {{ tl('currentAlarm') }}
    </div>

    <el-table :data="currentAlarmData" v-loading.lock="currentLockTable">
      <el-table-column prop="name" :label="$t('Alarm.alarmName')" sortable></el-table-column>
      <el-table-column prop="message" :label="$t('Alarm.alarmMsg')" sortable>
        <template slot-scope="{ row }">
          <el-popover placement="top" trigger="hover" width="160" :open-delay="500">
            <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
            <span slot="reference" class="details">
              <i class="iconfont el-icon-question"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.triggerNode')" sortable></el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.alarmLevel')" sortable>
        <template>
          {{ $t('Alarm.system') }}
        </template>
      </el-table-column>
      <el-table-column prop="activate_at" :label="$t('Alarm.activateAt')" sortable>
        <template slot-scope="{ row }">
          {{ dateFormat(row.activate_at) }}
        </template>
      </el-table-column>
      <el-table-column sortable>
        <span slot="header">
          {{ $t('Alarm.duration') }}
        </span>
        <template slot-scope="{ row }">
          <span v-show="row.duration">{{ getDuration(row.duration) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <common-pagination :count="currentAlarmCount" :reload-func="loadData"></common-pagination>

    <div class="section-header">
      <div>
        <span> {{ tl('historyAlarm') }} </span>
      </div>
      <div>
        <el-button
          type="danger"
          size="small"
          plain
          @click="clearHistoryAlarm"
          :disabled="!historyAlarmData.length"
        >
          {{ $t('Alarm.clearHistory') }}
        </el-button>
      </div>
    </div>

    <el-table :data="historyAlarmData" v-loading.lock="historyLockTable">
      <el-table-column prop="name" :label="$t('Alarm.alarmName')" sortable></el-table-column>
      <el-table-column prop="message" :label="$t('Alarm.alarmMsg')" sortable>
        <template slot-scope="{ row }">
          <el-popover placement="top" trigger="hover" width="160" :open-delay="500">
            <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
            <span slot="reference" class="details">
              <i class="iconfont el-icon-question"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.triggerNode')" sortable></el-table-column>
      <el-table-column prop="node" :label="$t('Alarm.alarmLevel')" sortable>
        <template>
          {{ $t('Alarm.system') }}
        </template>
      </el-table-column>
      <el-table-column prop="activate_at" :label="$t('Alarm.activateTime')" sortable>
        <template slot-scope="{ row }">
          {{ dateFormat(row.activate_at) }} - {{ dateFormat(row.deactivate_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="deactivate_at" :label="$t('Alarm.duration')" sortable>
        <template slot-scope="{ row }">
          {{ getDuration(row.duration) }}
        </template>
      </el-table-column>
    </el-table>
    <common-pagination :count="historyAlarmCount" :reload-func="loadHData"></common-pagination>
  </div>
</template>

<script>
import { loadAlarm, clearHistoryAlarm } from '@/api/common'
import { getDuration } from '@/common/utils'
import moment from 'moment'
import commonPagination from '../../components/commonPagination.vue'

export default {
  components: { commonPagination },
  name: 'Alarm',
  data() {
    return {
      currentAlarmData: [],
      historyAlarmData: [],
      currentLockTable: true,
      historyLockTable: true,
      currentAlarmCount: 0,
      historyAlarmCount: 0,
    }
  },
  // created() {
  //   this.loadData()
  //   this.loadHData()
  // },
  methods: {
    getDuration: getDuration,
    tl(key, collection = 'Alarm') {
      return this.$t(collection + '.' + key)
    },
    async clearHistoryAlarm() {
      let res = await clearHistoryAlarm().catch(() => {})
      if (res) {
        this.$message.success(this.$t('Alarm.clearSuccess'))
        this.loadHData()
      }
    },
    dateFormat(date) {
      let timestamp = Math.floor(+date / 1000)
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    },
    async loadData(params = {}) {
      let res = await loadAlarm(false, params).catch(() => {})
      if (res) {
        let { data, meta } = res

        this.currentAlarmData = data
        this.currentCount = meta.count
      }
      // ;(this.currentAlarmData = data), (this.currentAlarmMeta = meta)
      this.currentLockTable = false
      this.$store.dispatch('SET_ALERT_COUNT', this.currentAlarmData.length || 0)
    },
    async loadHData(params = {}) {
      let res = await loadAlarm(true, params).catch(() => {})
      if (res) {
        let { data, meta } = res
        this.historyAlarmCount = meta.count
        this.historyAlarmData = data
      }
      // ;(this.historyAlarmData = hdata), (this.historyAlarmMeta = hmeta)
      this.historyLockTable = false
    },
    getStateText(state) {
      const stateMap = {
        0: this.$t('Alarm.normal'),
      }
      return stateMap[state] || `${this.$t('Alarm.abnormal')} ${state} ${this.$t('Alarm.second')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.details {
  margin-right: 5px;
  color: #a7a7a7;
  cursor: pointer;
  vertical-align: middle;
}
</style>
