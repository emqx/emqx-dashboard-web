<template>
  <div>
    <div class="section-header">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-plus">
        {{ tl('addAuth') }}
      </el-button>
    </div>
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
