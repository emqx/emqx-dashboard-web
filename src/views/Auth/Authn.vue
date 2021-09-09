<template>
  <div class="authn app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="$router.push({ name: 'authenticationCreate' })"
      >
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table class="auth-table" :data="authnList" v-loading.lock="lockTable">
      <el-table-column prop="mechanism" :label="$t('Auth.mechanism')"></el-table-column>
      <el-table-column prop="backend" :label="$t('Auth.dataSource')"></el-table-column>
      <el-table-column prop="enable" :label="$t('Auth.status')">
        <template slot-scope="{ row }">
          <span :class="['status', { disabled: !row.enable }]">
            {{ row.enable ? 'Enable' : 'Disabled' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <table-dropdown :row-data="row" :table-data-len="authnList.length"></table-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import TableDropdown from './components/TableDropdown.vue'
import { listAuthn } from '@/api/auth'

export default defineComponent({
  name: 'Authn',
  components: {
    TableDropdown,
  },
  setup() {
    const authnList = ref([])
    const lockTable = ref(false)
    const loadData = async () => {
      lockTable.value = true
      const res = await listAuthn()
      console.log(res)
      lockTable.value = false
    }
    loadData()
    return {
      lockTable,
      authnList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style/authTable.scss';
</style>
