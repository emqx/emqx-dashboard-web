<template>
  <div class="authz app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button
        size="small"
        icon="el-icon-setting"
        @click="$router.push({ name: 'authorizationSetting' })"
      >
        {{ $t('Auth.setting') }}
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="$router.push({ name: 'authorizationCreate' })"
      >
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table class="auth-table" :data="authzList" v-loading.lock="lockTable">
      <el-table-column prop="type" :label="$t('Auth.dataSource')"></el-table-column>
      <el-table-column prop="enable" :label="$t('Auth.status')">
        <template slot-scope="{ row }">
          <span :class="['status', { disabled: !row.enable }]">
            {{ row.enable ? 'Enable' : 'Disabled' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <table-dropdown
            :row-data="row"
            :table-data-len="authzList.length"
            @update="handleUpdate"
          ></table-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import TableDropdown from './components/TableDropdown.vue'
import { listAuthz, updateAuthz } from '@/api/auth'

export default defineComponent({
  name: 'Authz',
  components: {
    TableDropdown,
  },
  setup() {
    const authzList = ref([])
    const lockTable = ref(false)
    const loadData = async () => {
      lockTable.value = true
      const res = await listAuthz()
      authzList.value = res.sources
      lockTable.value = false
    }
    loadData()
    const handleUpdate = async (row) => {
      await updateAuthz(row.type, row)
      loadData()
    }
    return {
      lockTable,
      authzList,
      handleUpdate,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style/authTable.scss';
</style>
