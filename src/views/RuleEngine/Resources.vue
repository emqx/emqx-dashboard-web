<template>
  <div class="resources">
    <div class="app-wrapper">
      <div class="emq-table-header">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleDialogVisible('add')"
        >
          {{ $t('Base.create') }}
        </el-button>
      </div>

      <el-table :data="tableData" class="data-list">
        <!-- <el-table-column class-name="expand-column" prop="id" type="expand" width="1px">
          <template slot-scope="{ row }">
            <el-card shadow="never" class="resource-node-wrapper" :loading="row.loading">
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
            </el-card>
          </template>
        </el-table-column> -->

        <el-table-column prop="id" min-width="80px" :label="$t('RuleEngine.resourceID')">
          <template slot-scope="{ row }">
            <router-link :to="{ name: 'resources-detail', params: { resId: row.id } }">{{
              row.id
            }}</router-link>
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
        <el-table-column prop="isAvailable" :label="$t('RuleEngine.status')">
          <template slot-scope="{ row }">
            <el-badge :type="row.isAvailable ? 'success' : 'danger'" is-dot> </el-badge
            ><span>{{
              row.isAvailable ? $t('RuleEngine.available') : $t('RuleEngine.notAvailable')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" prop="id" :label="$t('Base.operation')">
          <template slot-scope="{ row }">
            <!-- <el-button size="mini" @click="viewResourcesStatus(row, $index)">
              {{ $t('RuleEngine.status') }}
            </el-button> -->
            <el-button size="mini" @click="handleDialogVisible('edit', row)">
              {{ $t('Base.edit') }}
            </el-button>
            <el-button type="danger" size="mini" plain @click="deleteResource(row)">
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
import { loadResource, loadResourceTypes, destroyResource } from '@/api/rules'
// import ResourceNode from './components/ResourceNode'
import ResourceDialog from './components/ResourceDialog.vue'

export default {
  name: 'Resources',

  components: { ResourceDialog },

  props: {},

  data() {
    return {
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
    this.initData()
    this.loadData()
  },

  methods: {
    toggleShowConfig(row) {
      const showConfig = !row.showConfig
      this.$set(row, 'showConfig', showConfig)
    },

    // viewResourcesStatus(row, index) {
    //   const elExpand = document.querySelectorAll('.el-table__expand-icon')[index]
    //   if (elExpand) {
    //     elExpand.click()
    //   }
    // },

    // async handleExpandChange(row, reload = false) {
    //   if (!reload && row.status.length > 0) {
    //     return
    //   }
    //   const resource = await loadResourceDetails(row.id)
    //   if (resource) {
    //     this.$set(row, 'status', resource.status)
    //     this.$set(row, 'typeInfo', resource.typeInfo)
    //     this.$set(row, '_config', resource._config)
    //   }
    // },
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
      this.filterOptions.resourceTypes = resourceTypes.map(($) => ({
        text: $.title,
        value: $.name,
      }))
    },
    async loadData() {
      try {
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
      }
    },
    handleDialogVisible(oper, row) {
      this.dialogVisible = true
      this.oper = oper
      if (oper === 'edit') {
        this.resourceToEdit = { ...row }
      }
    },
    resourceTypesColumnFilter(value, row) {
      return row.config.name === value
    },
  },
}
</script>

<style lang="scss" scoped></style>
