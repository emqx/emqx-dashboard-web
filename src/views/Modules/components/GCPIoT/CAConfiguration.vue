<template>
  <div class="ca-configuration">
    <div class="ca-configuration-text">
      <p class="ca-configuration-title"></p>
      <p class="ca-configuration-desc"></p>
    </div>
    <div class="emq-table-header">
      <el-button type="primary" icon="el-icon-plus" size="small"> </el-button>
    </div>
    <el-table :data="caList" class="data-list" v-loading="listLoading">
      <el-table-column :prop="key" :label="'TODO:'" />
      <el-table-column width="120px">
        <template slot-scope="{ row }">
          <el-button type="dashed" size="mini" @click="showEdit(row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button type="dashed danger" size="mini" @click="handleDelete(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryKeys } from '@/api/modules.js'

export default {
  name: 'CAConfiguration',
  data() {
    return {
      listLoading: false,
      caList: [],
    }
  },
  methods: {
    async getKeyList() {
      try {
        this.listLoading = true
        this.caList = await queryKeys()
      } catch (error) {
        //
      } finally {
        this.listLoading = false
      }
    },
    showEdit() {},
    handleDelete() {},
  },
  created() {
    this.getKeyList()
  },
}
</script>
