<template>
  <div class="models">
    <a-card class="emq-list-card">
      <div class="emq-table-header">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$router.push(`/products/create/models?id=${productID}`)"
        >
          {{ $t('Base.create') }}
        </el-button>
      </div>
      <el-table :data="tableData" class="data-list">
        <el-table-column prop="thing_name" :label="$t('Models.modelName')">
          <template slot-scope="{ row }">
            <span class="btn" @click="$router.push(`/products/view/models?id=${productID}&modelId=${row.id}`)">
              {{ row.thing_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="service_id" :label="$t('Models.serviceID')"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="data_type" :label="$t('Models.dataFormat')">
          <template slot-scope="{ row }">
            <span>{{ dataTypeDic[row.data_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="thing_desp" :label="$t('General.remark')"></el-table-column>
        <!-- <el-table-column>
          <template slot-scope="{ row }">
            <el-button type="dashed danger" size="mini" @click="deleteConfirm(row)">
              {{ $t('General.delete') }}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </a-card>
  </div>
</template>

<script>
import { loadModel, destroyModel } from '@/api/models'

export default {
  name: 'Models',

  components: {},

  props: {
    tab: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      productID: undefined,
      tableData: [],
      dataTypeDic: {
        1: 'JSON',
        2: this.$t('Models.binary'),
      },
    }
  },

  watch: {
    tab(val) {
      if (val === 'models') {
        this.loadData(this.$route.query.id)
      }
    },
  },

  created() {
    this.productID = this.$route.query.id
    if (this.$route.query.tab && this.$route.query.tab === 'models') {
      this.loadData(this.productID)
    }
  },

  methods: {
    async loadData(productID) {
      const data = await loadModel(productID)
      this.tableData = data.items
    },
    deleteConfirm(item) {
      this.$msgbox
        .confirm(this.$t('Models.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(() => {
          destroyModel(item.id).then(() => {
            this.$message.success(this.$t('General.successfulDeletion'))
            this.loadData(this.$route.query.id)
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.models {
  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
