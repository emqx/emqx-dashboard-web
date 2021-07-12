<template>
  <div class="schemas app-wrapper">
    <el-button
      type="primary"
      size="small"
      icon="el-icon-plus"
      @click="
        $router.push({
          path: '/ruleengine/schemas/create',
        })
      "
    >
      {{ $t('Base.create') }}
    </el-button>

    <el-table :data="tableData">
      <el-table-column prop="name" :label="$t('Schemas.name')">
        <template slot-scope="{ row }">
          <router-link :to="{ path: '/ruleengine/schemas/detail', query: { id: row.name } }">{{
            row.name
          }}</router-link>
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
      <el-table-column
        prop="descr"
        show-overflow-tooltip
        :label="$t('Schemas.description')"
      ></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button type="danger" size="mini" plain @click="deleteData(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { loadSchemas, deleteSchema } from '@/api/schemas'

export default {
  name: 'Schemas',

  data() {
    return {
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
      const res = await loadSchemas().catch(() => {})
      if (res) {
        this.tableData = res
      }
    },

    deleteData(row) {
      this.$confirm(this.$t('Schemas.confirmDelete'), {
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteSchema(row.name).catch(() => {})
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
