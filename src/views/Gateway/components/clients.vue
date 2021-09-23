<template>
  <div>
    <el-form>
      <el-row :gutter="20" class="search-wrapper">
        <el-col :span="6">
          <el-input :placeholder="tl('clientid')" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input :placeholder="tl('username')" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input :placeholder="tl('username')" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="small">{{
            $t('Base.search')
          }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table>
      <el-table-column></el-table-column>
      <el-table-column></el-table-column>
      <el-table-column></el-table-column>
      <el-table-column></el-table-column>
      <el-table-column>
        <template> </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    return {
      tl,
    }
  },
})
</script>

<style lang="scss" scoped></style>
