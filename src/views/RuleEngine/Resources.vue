<template>
  <div class="resources">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              {{ $t('RuleEngine.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.resources') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            {{ $t('RuleEngine.resources') }}
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
        :loading="listLoading"
      >
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="createResource">{{ $t('RuleEngine.create') }}</el-button>
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
            :label="$t('RuleEngine.resourceTypes')"
            show-overflow-tooltip
            :filters="filterOptions.resourceTypes"
            :filter-method="resourceTypesColumnFilter"
            filter-placement="bottom"
          ></el-table-column>

          <el-table-column min-width="100px" prop="description" show-overflow-tooltip :label="$t('RuleEngine.remark')"></el-table-column>
          <!--<el-table-column min-width="70px" prop="status.is_alive" :label="$t('RuleEngine.state')">-->
          <!--<template slot-scope="{ row }">-->
          <!--<a-badge-->
          <!--:status="getStatus(row.status) ? 'success' : 'error'"-->
          <!--:text="getStateText(row.status)"-->
          <!--dot-->
          <!--&gt;-->
          <!--</a-badge>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column width="120px" prop="id">
            <template slot-scope="{ row }">
              <el-button v-if="!row.status.is_alive" type="dashed" size="mini" @click="reconnect(row)">{{ $t('RuleEngine.reconnect') }}</el-button>
              <el-button type="dashed" size="mini" @click="deleteResource(row)">{{ $t('RuleEngine.delete') }}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </a-card>
    </div>

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
      this.$msgbox.confirm(this.$t('RuleEngine.deleteResource'), {
        confirmButtonText: this.$t('RuleEngine.confirm'),
        cancelButtonText: this.$t('RuleEngine.cancel'),
        type: 'warning',
      }).then(async () => {
        await destroyResource(row.id)
        this.loadData()
        this.$message.success(this.$t('RuleEngine.successfulDeletion'))
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
