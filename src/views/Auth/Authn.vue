<template>
  <div class="authn app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="handleCreate">
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="authnList" v-loading.lock="lockTable">
      <el-table-column prop="mechanism" :label="$t('Auth.mechanism')"></el-table-column>
      <el-table-column prop="backend" :label="$t('Auth.dataSource')"></el-table-column>
      <el-table-column prop="enable" :label="$t('Auth.status')"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { listAuthn } from '@/api/auth'

export default defineComponent({
  name: 'Authn',
  setup() {
    const authnList = ref([])
    const lockTable = ref(false)
    const loadData = async () => {
      const res = await listAuthn()
      console.log(res)
    }
    loadData()
    const handleCreate = function () {
      this.$router.push({ name: 'authenticationCreate' })
    }
    return {
      lockTable,
      authnList,
      handleCreate,
    }
  },
})
</script>

<style lang="scss" scoped></style>
