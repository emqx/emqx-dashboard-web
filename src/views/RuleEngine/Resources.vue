<template>
  <div class="resources">

    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              {{ $t('Base.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.resources') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
        :loading="listLoading"
      >
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="createResource">
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list" @expand-change="handleExpandChange">
          <el-table-column prop="id" type="expand">
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
                  <!--<el-col v-if="false" :span="16">-->
                  <!--<div class="emq-title h3">-->
                  <!--资源配置-->
                  <!--<div class="sub-title btn btn-default" @click.stop="toggleShowConfig(row)">-->
                  <!--{{ row.showConfig ? '收起配置' : '展开配置' }}-->
                  <!--<i :class="row.showConfig ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>-->
                  <!--</div>-->
                  <!--</div>-->
                  <!--<el-collapse-transition>-->
                  <!--<resource-field v-if="row.showConfig" :config="row._config"></resource-field>-->
                  <!--</el-collapse-transition>-->
                  <!--</el-col>-->
                </el-row>
              </a-card>
            </template>
          </el-table-column>

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
          <el-table-column
            min-width="100px" prop="description" show-overflow-tooltip
            :label="$t('RuleEngine.remark')"
          ></el-table-column>
          <el-table-column width="120px" prop="id">
            <template slot-scope="{ row }">
              <!--<el-button v-if="!row.status.is_alive" type="dashed" size="mini" @click="reconnect(row)">{{ $t('RuleEngine.reconnect') }}</el-button>-->
              <el-button type="dashed" size="mini" @click="deleteResource(row)">
                {{ $t('RuleEngine.delete') }}
              </el-button>
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
  loadResource, loadResourceTypes, destroyResource, loadResourceDetails,
} from '@/api/rules'
import ResourceNode from './components/ResourceNode'
import ResourceDialog from './components/ResourceCreate'

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

    async handleExpandChange(row, reload = false) {
      if (reload !== true && row.status.length > 0) {
        return
      }
      try {
        if (row.loading === undefined) {
          this.$set(row, 'loading', true)
        }
        const resource = await loadResourceDetails(row.id)
        this.$set(row, 'status', resource.status)
        this.$set(row, 'typeInfo', resource.typeInfo)
        this.$set(row, '_config', resource._config)
      } catch (e) {
        console.log(e)
      } finally {
        this.$set(row, 'loading', false)
      }
    },
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
    async initData() {
      const resourceTypes = await loadResourceTypes()
      this.filterOptions.resourceTypes = resourceTypes.map($ => ({ text: $.title, value: $.name }))
    },
    async loadData() {
      try {
        this.listLoading = true
        const tableData = await loadResource()
        this.tableData = tableData.map(($) => {
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
}
</style>
