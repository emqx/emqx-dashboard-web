<template>
  <div class="alerts">
    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <div></div>
          <div>
            <el-button
              v-if="alertType === 'history'"
              class="btn-clear"
              type="danger"
              plain
              @click="clearHistoryAlarm"
              :disabled="!tableData.length || notAbleChange"
              size="mini"
            >
              {{ $t('Alerts.clearHistory') }}
            </el-button>
            <el-radio-group v-model="alertType" border size="mini" @change="loadData">
              <el-radio-button label="present">{{ $t('Alerts.currentAlarm') }}</el-radio-button>
              <el-radio-button label="history">{{ $t('Alerts.historyAlarm') }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <el-table v-bind="alertTable" :data="tableData" class="data-list" :key="alertType">
          <el-table-column prop="name" :label="$t('Alerts.alarmName')"></el-table-column>
          <el-table-column prop="message" :label="$t('Alerts.alarmMsg')" min-width="140px">
            <template slot-scope="{ row }">
              <el-popover placement="top" trigger="hover" width="160" :open-delay="500" popper-class="detail-popover">
                <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
                <span slot="reference" class="details">
                  <i class="iconfont icon-bangzhu"></i>
                </span>
              </el-popover>
              <span>{{ row.message }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="node" :label="$t('Alerts.triggerNode')"></el-table-column>
          <el-table-column prop="node" :label="$t('Alerts.alarmLevel')">
            <template>
              {{ $t('Alerts.system') }}
            </template>
          </el-table-column>
          <el-table-column prop="activate_at" :label="$t('Alerts.activateAt')">
            <template slot-scope="{ row }">
              {{ dateFormat(row.activate_at) }}
            </template>
          </el-table-column>
          <el-table-column v-if="alertType === 'history'" prop="deactivate_at" :label="$t('Alerts.deactivateAt')">
            <template slot-scope="{ row }">
              {{ dateFormat(row.deactivate_at) }}
            </template>
          </el-table-column>
          <el-table-column v-else>
            <span slot="header">
              {{ $t('Alerts.duration') }}
              <el-popover trigger="hover" placement="top">
                {{ $t('Alerts.durationTips') }}
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </span>
            <template slot-scope="{ row }">
              <span v-show="row.duration">{{ getDuration(row.duration) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import dateformat from 'dateformat'
import { loadAlarm, loadHistoryAlarm, clearHistoryAlarm } from '@/api/common'
import { getDateDiff } from '@/common/utils'

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
    getDuration(duration) {
      return getDateDiff(duration / 1000)
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

    async clearHistoryAlarm() {
      try {
        await this.$msgbox.confirm(this.$t('Alerts.clearHistoryConfirm'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        await clearHistoryAlarm()
        this.$message.success(this.$t('Alerts.clearSuccess'))
        this.loadData()
      } catch (error) {
        //
      }
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

.btn-clear {
  margin-right: 12px;
}
</style>

<style lang="scss">
.detail-popover {
  word-break: break-all;
}
</style>
