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
      <el-table-column prop="backend" :label="$t('Auth.dataSource')">
        <template slot-scope="{ row }">
          <img :src="row.img" width="48" />
          <span>{{ row.backend }}</span>
        </template>
      </el-table-column>
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
            :table-data-len="authnList.length"
            @update="handleUpdate"
            @delete="handleDelete"
            @setting="handleSetting"
            @move="handleMove"
          ></table-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import TableDropdown from './components/TableDropdown.vue'
import { listAuthn, updateAuthn, deleteAuthn, moveAuthn } from '@/api/auth'

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
      const res = await listAuthn().catch(() => {
        lockTable.value = false
      })
      if (res) {
        authnList.value = res.map((item) => ({
          ...item,
          img: require(`@/assets/img/${item.backend}.png`),
        }))
      }
      lockTable.value = false
    }
    loadData()
    const handleUpdate = async (row) => {
      const { img, ...data } = row
      await updateAuthn(row.id, data)
      loadData()
    }
    const handleDelete = async function ({ id }) {
      this.$confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          await deleteAuthn(id).catch(() => {})
          loadData()
        })
        .catch(() => {})
    }
    const handleSetting = function ({ id }) {
      this.$router.push({ path: `/authentication/detail/${id}` })
    }
    const handleMove = async function ({ id }, position) {
      const data = {
        position,
      }
      await moveAuthn(id, data)
      loadData()
    }
    return {
      lockTable,
      authnList,
      handleUpdate,
      handleDelete,
      handleSetting,
      handleMove,
    }
  },
})
</script>

<style lang="scss">
@import './style/authTable.scss';
</style>
