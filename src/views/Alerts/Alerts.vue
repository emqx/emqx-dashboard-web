<template>
  <div class="alerts">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              {{ $t('Alerts.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('Alerts.alarm') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">{{ $t('Alerts.alarm') }}</div>
        </div>

      </div>
    </div>

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
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="55">-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="id" width="130px" label="ID">-->
          <!--<template slot-scope="{ row }">-->
          <!--<span class="btn">{{ row.id }}</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="broker" :label="$t('Alerts.node')">-->
          <!--<template slot-scope="{ row }">-->
          <!--<span class="btn">{{ row.broker }}</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="type" min-width="180px" label="类型/触发阈值">-->
          <!--<template slot-scope="{ row }">-->
          <!--<span>{{ row.type }}  <el-tag size="mini" plain>{{ row.trigger }}</el-tag></span>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column prop="node" :label="$t('Alerts.triggerNode')" min-width="120px"></el-table-column>
          <el-table-column prop="id" :label="$t('Alerts.alarmType')" min-width="160px"></el-table-column>
          <el-table-column prop="node" :label="$t('Alerts.alarmLevel')" min-width="100px">
            <template slot-scope="{ row }">
              {{ $t('Alerts.system') }}
            </template>
          </el-table-column>

          <!--<el-table-column prop="description" show-overflow-tooltip :label="$t('Alerts.describe')"></el-table-column>-->
          <!--<el-table-column-->
          <!--prop="state"-->
          <!--class-name="align-table-column"-->
          <!--width="140px"-->
          <!--label="状态/告警值"-->
          <!--&gt;-->
          <!--<template slot-scope="{ row }">-->
          <!--<a-badge-->
          <!--:status="row.state === 0 ? 'success' : 'error'"-->
          <!--:text="getStateText(row.state)"-->
          <!--dot-->
          <!--&gt;-->
          <!--</a-badge>-->
          <!--<el-tag v-if="row.state > 0" size="mini" type="danger" style="margin-left: 10px">-->
          <!--{{ row.value }}-->
          <!--</el-tag>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column v-if="alertType === 'history'" prop="clear_at" width="180px" :label="$t('Alerts.clearanceTime')"></el-table-column>
          <!--<el-table-column prop="end_at" width="160px" :label="$t('Alerts.endingTime')"></el-table-column>-->

          <!--<el-table-column width="150px" prop="id">-->
          <!--<template slot-scope="{ row }">-->
          <!--<el-button v-if="row.level !== $t('Alerts.system')" type="dashed" size="mini">{{ $t('Alerts.delete') }}</el-button>-->
          <!--<el-button type="dashed" size="mini">{{ $t('Alerts.alarms') }}</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->

        </el-table>
      </a-card>
    </div>
  </div>
</template>


<script>
import { loadAlarm, loadHistoryAlarm } from '@/api/common'

export default {
  name: 'Alerts',

  components: {},

  filters: {},

  props: {},

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
      } else {
        this.tableData = await loadHistoryAlarm()
      }
    },

    getStateText(state) {
      const stateMap = {
        0: this.$t('Alerts.normal'),
      }
      return stateMap[state] || `异常 ${state} 次`
    },
  },
}
</script>


<style lang="scss" scoped>
.alerts {
}

.el-tag {
  margin-left: 10px;
}
</style>
