<template>
  <div class="auth-username-table">
    <div class="app-wrapper">
      <a-card class="emq-list-card" :loading="listLoading">
        <div class="emq-table-header">
          <el-row class="add-form" :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="record.username"
                size="small"
                :placeholder="$t('Clients.username')"
                @keyup.enter.native="save"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="record.password"
                size="small"
                type="password"
                :placeholder="$t('Base.password')"
                @keyup.enter.native="save"
              >
              </el-input>
            </el-col>
            <div class="col-oper">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="save">
                {{ $t('Base.add') }}
              </el-button>
            </div>
          </el-row>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="username" :label="$t('Clients.username')"> </el-table-column>
          <el-table-column prop="oper" width="120px">
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
      </a-card>
    </div>

    <el-dialog :visible.sync="editVisible" width="400px" :title="$t('Base.edit')" @keyup.enter.native="handleEdit">
      <el-form ref="editRecord" class="el-form--public app-info" size="medium" :rules="rules" :model="editRecord">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="username" :label="$t('Clients.username')">
              <el-input v-model="editRecord.username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="password" label="Password">
              <el-input v-model="editRecord.password" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" class="cache-btn" @click="editVisible = false">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" size="small" @click="handleEdit">
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAuthUsername,
  addAuthUsername,
  deleteAuthUsername,
  loadAuthUsername,
  updateAuthUsername,
} from '@/api/plugins'

export default {
  name: 'AuthUsernameTable',

  data() {
    return {
      editVisible: false,
      listLoading: true,
      record: {},
      tableData: [],
      editRecord: {},
      rules: {
        username: { required: true, message: this.$t('Plugins.pleaseEnter') },
        password: { required: true, message: this.$t('Plugins.pleaseEnter') },
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const data = await listAuthUsername()
      this.tableData = data.map((item) => ({
        username: item,
      }))
      this.listLoading = false
    },
    async save() {
      if (!this.record.username || !this.record.password) {
        this.$message.warning(this.$t('Plugins.authClientidRequired'))
        return
      }
      const data = { ...this.record }
      const res = await addAuthUsername(data)
      if (res) {
        this.loadData()
        this.record = {}
      }
    },
    handleDelete({ username }) {
      this.$confirm(this.$t('Plugins.confirmDelete'), this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteAuthUsername(username)
          if (res) {
            this.loadData()
          }
        })
        .catch(() => {})
    },
    async showEdit({ username }) {
      this.editVisible = true
      const res = await loadAuthUsername(username)
      this.editRecord = res
      this.editRecord.password = ''
      this.$refs.editRecord.resetFields()
    },
    handleEdit() {
      this.$refs.editRecord.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { username, password } = this.editRecord
        const data = {
          password,
        }
        await updateAuthUsername(username, data)
        this.loadData()
        this.$message.success(this.$t('Base.editSuccess'))
        this.editRecord = {}
        this.editVisible = false
        this.$refs.editRecord.resetFields()
      })
    },
  },
}
</script>

<style lang="scss">
.auth-username-table {
  .data-list {
    clear: both;
  }
  .app-wrapper {
    .add-form {
      display: block;
      width: 100%;
      .el-select {
        width: 100%;
      }
      .col-oper {
        .el-button {
          margin-left: 12px;
        }
      }
      .el-col-8 {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
