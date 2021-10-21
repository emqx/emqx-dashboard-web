<template>
  <div>
    <!-- <div class="section-header">
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
    </el-table> -->
    <authn :gateway="true" :gatewayName="name"></authn>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import Authn from '../../Auth/Authn.vue'

export default defineComponent({
  name: 'GatewayDetailAuth',
  components: { Authn },
  data: function () {
    return {
      name: String(this.$route.params.name).toLowerCase(),
    }
  },
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
