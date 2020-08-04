<template>
  <div class="models">
    <a-card class="emq-list-card">
      <div class="emq-table-header">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$router.push(`/products/create/models?id=${id}`)"
        >
          {{ $t('Base.create') }}
        </el-button>
      </div>
      <el-table :data="tableData" class="data-list">
        <el-table-column prop="name" :label="$t('Models.modelName')">
          <template slot-scope="{ row }">
            <span class="btn" @click="$router.push(`/products/view/models?id=${id}`)">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="desc" :label="$t('General.remark')"></el-table-column>
        <el-table-column>
          <template slot-scope="{ row }">
            <el-button
              type="dashed danger"
              size="mini"
              @click="deleteConfirm(row)"
            >
              {{ $t('General.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </a-card>
  </div>
</template>


<script>

import {
  destroyAPP,
} from '@/api/function'

export default {
  name: 'Models',

  components: {},

  props: {
    id: {
      required: true,
      type: Number,
    },
  },

  data() {
    return {
      tableData: [
        {
          id: 1,
          name: 'test',
          desc: '备注',
        },
        {
          id: 2,
          name: 'test2',
          desc: '备注2',
        },
      ],
    }
  },

  created() {
    // this.loadData()
  },

  methods: {
    // async loadData() {
    //   this.tableData = await loadApp()
    // },
    deleteConfirm(item) {
      const vue = this
      this.$msgbox.confirm(this.$t('Models.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        destroyAPP(item.id).then(() => {
          vue.$message.success(this.$t('General.successfulDeletion'))
          vue.loadData()
        })
      }).catch(() => {})
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
