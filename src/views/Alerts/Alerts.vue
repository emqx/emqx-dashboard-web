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
          <el-table-column prop="node" :label="$t('Alerts.triggerNode')" min-width="120px"></el-table-column>
          <el-table-column prop="id" :label="$t('Alerts.alarmType')" min-width="160px"></el-table-column>
          <el-table-column prop="node" :label="$t('Alerts.alarmLevel')" min-width="100px">
            <template>
              {{ $t('Alerts.system') }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="alertType === 'history'" prop="clear_at" width="180px" :label="$t('Alerts.alarmTime')"
          >
          </el-table-column>
          <el-table-column
            v-else prop="create_at" width="180px" :label="$t('Alerts.alarmTime')"
          >
          </el-table-column>
        </el-table>

      </a-card>
    </div>
  </div>
</template>


<script>
import { loadAlarm, loadHistoryAlarm } from '@/api/common'

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
</style>
