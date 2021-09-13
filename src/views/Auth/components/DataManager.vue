<template>
  <div class="data-manager">
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="dataManager.user_id" :placeholder="field"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input
              v-model="dataManager.password"
              type="password"
              placeholder="password"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="dataManager.is_superuser" label="is_superuser" border></el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
            {{ $t('Base.add') }}
          </el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="user_id" :label="field"></el-table-column>
      <el-table-column prop="is_superuser" label="is_superuser">
        <template slot-scope="{ row }">
          {{ row.is_superuser ? $t('Base.yes') : $t('Base.no') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-dropdown class="table-dropdown" @command="handleCommand(row, $event)">
            <el-button class="dropdown-btn" size="mini">
              <i class="el-icon-more"></i>
            </el-button>
            <el-dropdown-menu>
              <el-dropdown-item command="delete">
                <i class="el-icon-delete"></i>
                {{ $t('Base.delete') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { loadAuthnUsers, createAuthnUsers, deleteAuthnUser } from '@/api/auth'

export default defineComponent({
  name: 'DataManager',
  props: {
    field: {
      type: String,
      required: true,
    },
  },
  setup() {
    const dataManager = reactive({
      user_id: '',
      password: '',
      is_superuser: false,
    })
    const tableData = ref([])
    const lockTable = ref(false)
    const id = computed(function () {
      return this.$route.params.id
    })
    const loadData = async (id) => {
      lockTable.value = true
      const res = await loadAuthnUsers(id)
      tableData.value = res
      lockTable.value = false
    }
    loadData(id.value)
    const handleAdd = async function () {
      await createAuthnUsers(id.value, dataManager)
      this.$message.success(this.$t('Base.createSuccess'))
      dataManager.user_id = ''
      dataManager.password = ''
      dataManager.is_superuser = false
      loadData(id.value)
    }
    const handleCommand = async function (row, command) {
      if (command === 'delete') {
        this.$confirm(this.$t('General.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
          .then(async () => {
            await deleteAuthnUser(id.value, row.user_id).catch(() => {})
            loadData(id.value)
          })
          .catch(() => {})
      }
    }
    return {
      tableData,
      lockTable,
      dataManager,
      handleAdd,
      handleCommand,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-manager {
  .el-checkbox.is-bordered {
    margin: 0;
    width: 100%;
  }
}
</style>
