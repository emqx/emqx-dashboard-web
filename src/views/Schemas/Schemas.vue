<template>
  <div class="schemas">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ $t('Schemas.schemaDesc') }}
          </p>
          <div class="page-header-top-start">
            <a rel="noopener" :href="docs.tutorial" target="_blank" class="link-item">
              <i class="icon el-icon-position"></i>
              {{ $t('Schemas.quickStart') }}
            </a>
          </div>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="
              $router.push({
                path: '/schemas/0',
                query: { oper: 'create' },
              })
            "
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="name" :label="$t('Schemas.name')">
            <template slot-scope="{ row }">
              <a
                href="javascript:;"
                @click="
                  $router.push({
                    path: `/schemas/${row.name}`,
                    query: { oper: 'view' },
                  })
                "
              >
                {{ row.name }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="parser_type"
            :label="$t('Schemas.parser_type')"
            :filters="parserTypes"
            :filter-method="parserTypesColumnFilter"
            filter-placement="bottom"
          >
          </el-table-column>
          <el-table-column prop="descr" show-overflow-tooltip :label="$t('Schemas.description')"></el-table-column>
          <el-table-column width="80px">
            <template slot-scope="{ row }">
              <el-button type="dashed danger" size="mini" @click="deleteData(row)">
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
import { loadSchemas, deleteSchema } from '@/api/schemas'
import { getLink } from '@/common/utils'

export default {
  name: 'Schemas',

  data() {
    return {
      docs: {
        tutorial: getLink('schemaTutorial'),
      },
      tableData: [],
      parserTypes: [
        { text: 'avro', value: 'avro' },
        { text: 'protobuf', value: 'protobuf' },
        { text: '3rd-party', value: '3rd-party' },
      ],
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

    deleteData(row) {
      this.$confirm(this.$t('Schemas.confirmDelete'), {
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteSchema(row.name)
          if (res) {
            this.loadData()
            this.$message.success(this.$t('Base.deleteSuccess'))
          }
        })
        .catch(() => {})
    },

    parserTypesColumnFilter(value, row) {
      return value === row.parser_type
    },
  },
}
</script>
