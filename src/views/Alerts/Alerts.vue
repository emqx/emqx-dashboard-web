<template>
  <div class="alerts">
    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <div></div>
          <el-radio-group v-model="alertType" border size="mini" @change="loadData">
            <el-radio-button label="present">{{ $t('Alerts.currentAlarm') }}</el-radio-button>
            <el-radio-button label="history">{{ $t('Alerts.historyAlarm') }}</el-radio-button>
          </el-radio-group>
        </div>

        <el-table v-bind="alertTable" :data="tableData" class="data-list">
          <el-table-column prop="name" :label="$t('Alerts.alarmName')"></el-table-column>
          <el-table-column prop="message" :label="$t('Alerts.alarmMsg')" min-width="140px">
            <template slot-scope="{ row }">
              <el-popover placement="top" trigger="hover" width="160" :open-delay="500">
                <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
                <span slot="reference" class="details">
                  <i class="iconfont icon-bangzhu"></i>
                </span>
              </el-popover>
              <span>{{ row.message }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="node" :label="$t('Alerts.triggerNode')" min-width="120px"></el-table-column>
          <el-table-column prop="node" :label="$t('Alerts.alarmLevel')" min-width="100px">
            <template>
              {{ $t('Alerts.system') }}
            </template>
          </el-table-column>
          <el-table-column prop="activate_at" width="180px" :label="$t('Alerts.activateAt')">
            <template slot-scope="{ row }">
              {{ dateFormat(row.activate_at) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="alertType === 'history'"
            prop="deactivate_at"
            width="180px"
            :label="$t('Alerts.deactivateAt')"
          >
            <template slot-scope="{ row }">
              {{ dateFormat(row.deactivate_at) }}
            </template>
          </el-table-column>
          <el-table-column v-else :label="$t('Alerts.duration')">
            <template slot-scope="{ row }">
              {{ getDuration(row.activate_at) }}
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import { loadAlarm, loadHistoryAlarm } from '@/api/common'
import { getDateDiff } from '@/common/utils'
import dateformat from 'dateformat'

export default {
  name: 'Alerts',

  data() {
    return {
      alertTable: {
        'row-key': 'id',
        'default-expand-all': true,
        'tree-props': { children: 'children', hasChildren: 'hasChildren' },
      },
      tableData: [],
      alertType: 'present',
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    getDuration(activateAt) {
      return getDateDiff(activateAt / 1000, Date.now())
    },
    dateFormat(date) {
      if (typeof date !== 'number' && date === 'infinity') {
        return ''
      }
      return dateformat(date / 1000, 'yyyy-mm-dd HH:MM:ss')
    },
    async loadData() {
      if (this.alertType === 'present') {
        this.tableData = await loadAlarm()
        this.$store.dispatch('SET_ALERT_COUNT', (this.tableData || []).length)
      } else {
        this.tableData = await loadHistoryAlarm()
      }
    },

    getStateText(state) {
      const stateMap = {
        0: this.$t('Alerts.normal'),
      }
      return stateMap[state] || `${this.$t('Alerts.abnormal')} ${state} ${this.$t('Alerts.second')}`
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
