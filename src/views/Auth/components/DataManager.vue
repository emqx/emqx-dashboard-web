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
              :placeholder="$t('General.password')"
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
              <el-dropdown-item command="edit">
                <i class="el-icon-edit-outline"></i>
                {{ $t('Base.edit') }}
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <i class="el-icon-delete"></i>
                {{ $t('Base.delete') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('Base.edit')" :visible.sync="dialogVisible">
      <el-form ref="recordForm" :model="record" :rules="getRules()">
        <el-form-item prop="username" :label="field">
          <el-input v-model="record.user_id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('General.password')">
          <el-input v-model="record.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-checkbox v-model="record.is_superuser" label="is_superuser" border></el-checkbox>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="dialogVisible = false">
          {{ $t('Base.cancel') }}
        </el-button>

        <el-button type="primary" size="small" @click="handleUpdate">
          {{ $t('Base.update') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { loadAuthnUsers, createAuthnUsers, deleteAuthnUser, updateAuthnUser } from '@/api/auth'

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
    let record = ref({})
    const tableData = ref([])
    const lockTable = ref(false)
    const dialogVisible = ref(false)
    const id = computed(function () {
      return this.$route.params.id
    })
    const loadData = async (id) => {
      lockTable.value = true
      const res = await loadAuthnUsers(id).catch(() => {
        lockTable.value = false
      })
      if (res) {
        tableData.value = res
      }
      lockTable.value = false
    }
    loadData(id.value)
    const getRules = function () {
      return {
        password: [{ required: true, message: this.$t('General.pleaseEnterPassword') }],
      }
    }
    const handleAdd = async function () {
      if (dataManager.user_id === '' || dataManager.password === '') {
        return
      }
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
      } else if (command === 'edit') {
        dialogVisible.value = true
        record.value = {
          user_id: row.user_id,
          is_superuser: row.is_superuser,
          password: '',
        }
      }
    }
    const handleUpdate = async function () {
      let validation = await this.$refs.recordForm.validate().catch(() => {})
      if (!validation) {
        return
      }
      const { password, is_superuser, user_id } = record.value
      const data = {
        password: password,
        is_superuser: is_superuser,
      }
      await updateAuthnUser(id.value, user_id, data)
      dialogVisible.value = false
      this.$message.success(this.$t('Base.updateSuccess'))
      loadData(id.value)
    }
    return {
      dialogVisible,
      tableData,
      lockTable,
      dataManager,
      record,
      handleUpdate,
      handleAdd,
      handleCommand,
      getRules,
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
  .dropdown-btn {
    padding: 1px 6px;
  }
}
</style>
