<template>
  <div class="alarm app-wrapper">
    <div class="section-header">
      {{ tl('currentAlarm') }}
    </div>

    <el-table v-bind="alertTable" :data="currentAlarmData">
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

    <div class="section-header">
      {{ tl('historyAlarm') }}
    </div>

    <el-table v-bind="alertTable" :data="historyAlarmData">
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
  </div>
</template>

<script>
import { loadAlarm, loadHistoryAlarm } from '@/api/common'
import { getDateDiff } from '@/common/utils'
import moment from 'moment'

export default {
  name: 'Alarm',

  data() {
    return {
      alertTable: {
        'row-key': 'id',
        'default-expand-all': true,
        'tree-props': { children: 'children', hasChildren: 'hasChildren' },
      },
      currentAlarmData: [],
      historyAlarmData: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    tl(key, collection = 'Alarm') {
      return this.$t(collection + '.' + key)
    },
    getDuration(duration) {
      let dateDiff = getDateDiff(duration / 1000)
      let readableDate = []
      dateDiff.reduce((c, v, i) => {
        if (c == 0 && v == 0) {
        } else {
          switch (i) {
            case 0:
              readableDate.push([v, this.$tc('General.day', v)])
              break
            case 1:
              readableDate.push([v, this.$tc('General.hour', v)])
              break
            case 2:
              readableDate.push([v, this.$tc('General.min', v)])
              break
            case 3:
              readableDate.push([v, this.$tc('General.sec', v)])
              break
          }
        }
        return c + v
      }, 0)

      return readableDate
        .map((_) => {
          return _.join(this.$t('General.timeSep'))
        })
        .join(this.$t('General.timePartSep'))
    },
    dateFormat(date) {
      let timestamp = Math.floor(+date / 1000)
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    },
    async loadData() {
      this.currentAlarmData = await loadAlarm().catch(() => {})
      this.$store.dispatch('SET_ALERT_COUNT', this.currentAlarmData.length || 0)
      this.historyAlarmData = await loadHistoryAlarm()
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
.el-tag {
  margin-left: 10px;
}

.details {
  margin-right: 5px;
  color: #a7a7a7;
  cursor: pointer;
  vertical-align: middle;
}
</style>
