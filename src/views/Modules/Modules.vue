<template>
  <div class="modules">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Modules.modules') }}
          <emq-select
            v-model="nodeName"
            class="node-select"
            size="small"
            :field="{ options: currentNodes }"
            :field-name="{ label: 'name', value: 'node' }"
            @change="handleNodeChange"
          ></emq-select>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <el-table :data="tableData" class="data-list">
          <el-table-column prop="name" width="250" :label="$t('Modules.name')">
          </el-table-column>
          <el-table-column prop="description" min-width="350" :label="$t('Modules.description')">
          </el-table-column>
          <el-table-column
            prop="active"
            width="150"
            filter-placement="bottom"
            :filter-method="handleStatusFilter"
            :filters="[{ text: $t('Modules.disabled'), value: false }, { text: $t('Modules.enabled'), value: true }]"
            :label="$t('RuleEngine.status')"
          >
            <template slot-scope="props">
              <span :class="[props.row.active ? 'running' : '', 'status']">
                {{ props.row.active ? $t('Modules.enabled'): $t('Modules.disabled') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="160">
            <template slot-scope="props">
              <el-button
                size="mini"
                :type="`dashed ${props.row.active ? 'danger' : ''}`"
                @click="update(props.row)"
              >
                {{ props.row.active ? $t('Modules.disable') : $t('Modules.enable') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>
  </div>
</template>


<script>
import {
  listModules, updateModules,
} from '@/api/modules'
import { loadNodes } from '@/api/common'

export default {
  name: 'Modules',

  data() {
    return {
      listLoading: true,
      tableData: [],
      nodeName: '',
      currentNodes: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    handleNodeChange() {
      this.loadModuels()
    },
    async update(row) {
      await updateModules(this.nodeName, row)
      this.$message.success(
        `${row.active ? this.$t('Base.disabledSuccess') : this.$t('Base.enableSuccess')}`,
      )
      this.loadModuels()
    },
    async loadData() {
      this.currentNodes = await loadNodes()
      this.nodeName = this.nodeName || (this.currentNodes[0] || {}).node
      this.listLoading = false
      this.loadModuels()
    },
    async loadModuels(params = {}) {
      const data = await listModules(this.nodeName, { ...params })
      this.tableData = data
    },
    handleStatusFilter(value, row) {
      return value === row.active
    },
  },
}
</script>


<style lang="scss">
.modules {
  .data-list {
    clear: both;
  }
  .page-header-content-view {
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  /* Running Status */
  .status:before {
    content: "";
    display: inline-block;
    height: 8px;
    width: 8px;
    margin-right: 3px;
    border-radius: 4px;
  }
  .status {
    &:before {
      background-color: #a7a7a7;
    }
    &.running {
      color: #34c388;
    }
    &.stopped.danger {
      &:before {
        background-color: #F56C6C;
      }
    }
    &.running:before {
      background-color: #34c388;
    }
  }
}
</style>
