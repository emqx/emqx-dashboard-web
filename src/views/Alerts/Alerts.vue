<template>
  <div class="alerts">
    <a-card
      class="emq-list-card"
      title="告警规则列表"
    >
      <div class="emq-table-header">
        <el-button type="primary" @click="$router.push('/alerts/create')">添加规则</el-button>
      </div>

      <el-table v-bind="alertTable" :data="tableData" class="data-list">
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--width="55">-->
        <!--</el-table-column>-->
        <el-table-column prop="id" width="130px" label="ID">
          <template slot-scope="{ row }">
            <span class="btn">{{ row.id }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="broker" label="节点">-->
        <!--<template slot-scope="{ row }">-->
        <!--<span class="btn">{{ row.broker }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="type" min-width="180px" label="类型/触发阈值">
          <template slot-scope="{ row }">
            <span>{{ row.type }}  <el-tag size="mini" plain>{{ row.trigger }}</el-tag></span>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="级别"></el-table-column>
        <el-table-column prop="description" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column
          prop="state"
          class-name="align-table-column"
          width="140px"
          label="状态/告警值"
        >
          <template slot-scope="{ row }">
            <a-badge
              :status="row.state === 0 ? 'success' : 'error'"
              :text="getStateText(row.state)"
              dot
            >
            </a-badge>
            <el-tag v-if="row.state > 0" size="mini" type="danger" style="margin-left: 10px">
              {{ row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="start_at" width="180px" label="触发时间"></el-table-column>
        <!--<el-table-column prop="end_at" width="160px" label="结束时间"></el-table-column>-->

        <el-table-column width="150px" prop="id">
          <template slot-scope="{ row }">
            <el-button v-if="row.level !== '系统'" type="dashed" size="mini">删除</el-button>
            <el-button type="dashed" size="mini">告警列表</el-button>
          </template>
        </el-table-column>

      </el-table>
    </a-card>

  </div>
</template>


<script>

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
      tableData: [
        {
          id: 'alerts:3ca4d1f',
          type: '设备连接数',
          level: '用户',
          trigger: '> 18000',
          value: '',
          description: '连接数超过 18000',
          state: 0,
          start_at: 'N/A',
          end_at: 'N/A',
        },
        {
          id: 'alerts:4c4412',
          type: '内存使用',
          level: '系统',
          trigger: '> 80%',
          value: '',
          description: '内存占用率过高',
          state: 0,
          start_at: 'N/A',
          end_at: 'N/A',
        },
        {
          id: 'alerts:8cc1341',
          type: '磁盘使用',
          level: '系统',
          trigger: '> 90%',
          value: '92%',
          description: '磁盘剩余空间不足',
          state: 0,
          start_at: '2019-06-22 14:32:12',
          end_at: '2019-06-22 18:21:57',
        },
        {
          id: 'alerts:8cc1347',
          type: '集群',
          level: '系统',
          trigger: '节点数变化',
          value: '3',
          description: '集群中节点数变化，包括节点加入、离开集群',
          state: 3,
          start_at: '2019-06-23 22:12:44',
          end_at: '',
        },
      ],
    }
  },

  created() {
  },

  methods: {
    getStateText(state) {
      const stateMap = {
        0: '正常',
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
