<template>
  <div class="resources">
    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            :disabled="notAbleChange"
            @click="handleDialogVisible('add')"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list" @expand-change="handleExpandChange">
          <el-table-column class-name="expand-column" prop="id" type="expand" width="1px">
            <template slot-scope="{ row }">
              <!-- 列表展示每个节点上资源的状态 -->
              <a-card class="resource-node-wrapper" :loading="row.loading">
                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="emq-title h3">
                      {{ $t('RuleEngine.resourceStatus') }}
                      <div class="sub-title">
                        {{ $t('RuleEngine.resourceStatusTips') }}
                      </div>
                    </div>
                    <resource-node :value="row" @change="handleExpandChange"></resource-node>
                  </el-col>
                </el-row>
              </a-card>
            </template>
          </el-table-column>

          <el-table-column prop="id" min-width="80px" :label="$t('RuleEngine.resourceID')">
            <template slot-scope="{ row }">
              <span class="btn" @click="showResource(row)">{{ row.id }}</span>
            </template>
          </el-table-column>
          <!-- 资源类型 -->
          <el-table-column
            prop="config.title"
            show-overflow-tooltip
            :label="$t('RuleEngine.resourceTypes')"
            :filters="filterOptions.resourceTypes"
            :filter-method="resourceTypesColumnFilter"
            filter-placement="bottom"
          ></el-table-column>
          <el-table-column
            min-width="100px"
            prop="description"
            show-overflow-tooltip
            :label="$t('RuleEngine.resourceDes')"
          ></el-table-column>
          <el-table-column prop="isAvailable" :label="$t('RuleEngine.isAvailable')">
            <template slot-scope="{ row }">
              <a-badge
                style="font-size: 12px"
                :status="row.isAvailable ? 'success' : 'error'"
                :text="row.isAvailable ? $t('RuleEngine.available') : $t('RuleEngine.notAvailable')"
                dot
              >
              </a-badge>
            </template>
          </el-table-column>
          <el-table-column width="200px" prop="id">
            <template slot-scope="{ row, $index }">
              <el-button type="dashed" size="mini" @click="viewResourcesStatus(row, $index)">
                {{ $t('RuleEngine.status') }}
              </el-button>
              <el-button type="dashed" size="mini" :disabled="notAbleChange" @click="handleDialogVisible('edit', row)">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button type="dashed danger" size="mini" :disabled="notAbleChange" @click="deleteResource(row)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>

    <resource-dialog
      :editItem="resourceToEdit"
      :oper="oper"
      :visible.sync="dialogVisible"
      @created="loadData"
    ></resource-dialog>
  </div>
</template>

<script>
import { loadResource, loadResourceTypes, destroyResource, loadResourceDetails } from '@/api/rules'
import ResourceNode from './components/ResourceNode'
import ResourceDialog from './components/ResourceDialog.vue'

export default {
  name: 'Resources',

  components: { ResourceNode, ResourceDialog },

  props: {},

  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      tableData: [],
      filterOptions: {
        resourceTypes: [],
      },
      oper: 'add',
      resourceToEdit: {},
    }
  },

  created() {
    this.listLoading = true
    this.initData()
    this.loadData()
  },

  methods: {
    toggleShowConfig(row) {
      const showConfig = !row.showConfig
      this.$set(row, 'showConfig', showConfig)
    },

    viewResourcesStatus(row, index) {
      const elExpand = document.querySelectorAll('.el-table__expand-icon')[index]
      if (elExpand) {
        elExpand.click()
      }
    },

    async handleExpandChange(row, reload = false) {
      if (!reload && row.status.length > 0) {
        return
      }
      const resource = await loadResourceDetails(row.id)
      if (resource) {
        this.$set(row, 'status', resource.status)
        this.$set(row, 'typeInfo', resource.typeInfo)
        this.$set(row, '_config', resource._config)
      }
    },
    deleteResource(row) {
      this.$msgbox
        .confirm(this.$t('RuleEngine.deleteResource'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyResource(row.id)
          this.loadData()
          this.$message.success(this.$t('Base.deleteSuccess'))
        })
        .catch(() => {})
    },
    async initData() {
      const resourceTypes = await loadResourceTypes()
      this.filterOptions.resourceTypes = resourceTypes.map(($) => ({ text: $.title, value: $.name }))
    },
    async loadData() {
      try {
        this.listLoading = true
        const tableData = await loadResource()
        this.tableData = tableData.map(($) => {
          $.isAvailable = $.status
          delete $.status
          $._config = []
          $.typeInfo = {}
          $.status = []
          return $
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
      }
    },
    handleDialogVisible(oper, row) {
      this.dialogVisible = true
      this.oper = oper
      if (oper === 'edit') {
        this.resourceToEdit = { ...row }
      }
    },
    showResource(row) {
      this.$router.push({
        name: 'resources-view',
        params: {
          id: row.id,
        },
        query: { oper: 'view' },
      })
    },
    resourceTypesColumnFilter(value, row) {
      return row.config.name === value
    },
  },
}
</script>

<style lang="scss">
.resources {
  .emq-title {
    margin-bottom: 20px;
  }

  .resource-node-wrapper {
    .ant-card-body {
      padding: 0 0 0 20px;
    }
  }

  .expand-column .cell {
    visibility: hidden;
  }
}
</style>
