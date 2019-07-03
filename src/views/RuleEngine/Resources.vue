<template>
  <div class="resources">
    <a-card
      class="emq-list-card"
      title="资源列表"
      :loading="listLoading"
    >
      <div class="emq-table-header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="createResource">创建</el-button>
      </div>

      <el-table :data="tableData" class="data-list">
        <el-table-column prop="id" min-width="80px" label="ID">
          <template slot-scope="{ row }">
            <span class="btn" @click="showResource(row)">{{ row.id }}</span>
          </template>
        </el-table-column>

        <!-- 资源类型 -->
        <el-table-column
          prop="config.title"
          label="资源类型"
          show-overflow-tooltip
          :filters="filterOptions.resourceTypes"
          :filter-method="resourceTypesColumnFilter"
          filter-placement="bottom"
        ></el-table-column>

        <el-table-column min-width="100px" prop="description" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column min-width="70px" prop="status.is_alive" label="状态">
          <template slot-scope="{ row }">
            <a-badge
              :status="row.status.is_alive ? 'success' : 'error'"
              :text="getStateText(row.status.is_alive)"
              dot
            >
            </a-badge>
          </template>
        </el-table-column>

        <el-table-column width="120px" prop="id">
          <template slot-scope="{ row }">
            <el-button v-if="!row.status.is_alive" type="dashed" size="mini" @click="reconnect(row)">重连</el-button>
            <el-button type="dashed" size="mini" @click="deleteResource(row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </a-card>

    <resource-dialog :visible.sync="dialogVisible" @created="loadData"></resource-dialog>

  </div>
</template>


<script>
import {
  loadResource, loadResourceTypes, destroyResource, reconnectResource,
} from '@/api/rules'
import ResourceDialog from './components/ResourceCreate'

export default {
  name: 'Resources',

  components: { ResourceDialog },

  props: {},

  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      tableData: [],
      filterOptions: {
        resourceTypes: [],
      },
    }
  },

  created() {
    this.listLoading = true
    this.initData()
    this.loadData()
  },

  methods: {
    deleteResource(row) {
      this.$msgbox.confirm('此操作将停用并删除该资源, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await destroyResource(row.id)
        this.loadData()
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    reconnect(row) {
      reconnectResource(row.id).then(() => {
        setTimeout(this.loadData, 100)
      })
    },
    async initData() {
      const resourceTypes = await loadResourceTypes()
      this.filterOptions.resourceTypes = resourceTypes.map($ => ({ text: $.title, value: $.name }))
    },
    async loadData() {
      this.tableData = await loadResource().catch(() => {
        this.listLoading = false
      })
      this.listLoading = false
    },
    createResource() {
      this.dialogVisible = true
    },
    showResource(row) {
      this.$router.push({ path: `/resources/${row.id}` })
    },
    getStateText(is_alive) {
      return is_alive ? '可用' : '不可用'
    },
    resourceTypesColumnFilter(value, row) {
      return row.name === value
    },
  },
}
</script>


<style lang="scss" scoped>
.resources {
}
</style>
