<template>
  <div class="schemas">

    <page-header
      :back-title="$t('Schemas.schema')"
    >
      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ $t('Schemas.schemaDesc') }}
          </p>
          <div class="page-header-link">
            <a href="javascript:;" target="_blank" class="link-item">
              <i class="icon el-icon-document"></i>
              {{ $t('Schemas.docs') }}
            </a>
            <a href="javascript:;" target="_blank" class="link-item">
              <i class="icon iconfont icon-icon_fabu"></i>
              {{ $t('Schemas.example') }}
            </a>
          </div>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
      >

        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="$router.push('/schemas/create')"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="name" :label="$t('Schemas.name')">
            <template slot-scope="{ row }">
              <a href="javascript:;" @click="viewDetail(row)">{{ row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="parser_type" :label="$t('Schemas.parser_type')">
          </el-table-column>
          <el-table-column prop="version" :label="$t('Schemas.version')">
          </el-table-column>
          <el-table-column
            prop="descr"
            show-overflow-tooltip
            :label="$t('Schemas.description')"
          ></el-table-column>
          <el-table-column width="80px">
            <template slot-scope="{ row }">
              <el-button
                type="dashed danger"
                size="mini"
                @click="deleteSchema(row)"
              >
                {{ $t('RuleEngine.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>
  </div>
</template>


<script>
import { loadSchemas, deleteSchema, viewSchema } from '@/api/schemas'

export default {
  name: 'Schemas',

  data() {
    return {
      tableData: [],
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const res = await loadSchemas()
      if (res) {
        this.tableData = res
      }
    },

    async viewDetail(row) {
      const res = await viewSchema(row.id)
      console.log(res)
    },

    deleteSchema(row) {
      this.$confirm(this.$t('Schemas.confirmDelete'), {
        type: 'warning',
      }).then(async () => {
        const res = await deleteSchema(row.id)
        if (res) {
          this.loadData()
          this.$message.success(this.$t('Base.deleteSuccess'))
        }
      }).catch(() => {})
    },
  },
}
</script>
