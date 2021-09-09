<template>
  <div class="users app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog()">
        {{ $t('Base.create') }}
      </el-button>
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column sortable prop="username" :label="$t('General.userName')"></el-table-column>
      <el-table-column sortable prop="tag" :label="$t('General.remark')"></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template slot-scope="{ row }">
          <el-button plain size="mini" @click="showDialog('edit', row)"
            >{{ $t('Base.edit') }}
          </el-button>
          <el-button plain size="mini" @click="showDialog('chPass', row)">{{
            $t('General.changePassword')
          }}</el-button>

          <el-button type="danger" size="mini" plain @click="deleteConfirm(row)"
            >{{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="
        accessType === 'edit'
          ? $t('General.editorUser')
          : accessType === 'chPass'
          ? $t('General.changePassword')
          : $t('General.creatingUser')
      "
      :visible.sync="dialogVisible"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-form-item
          v-if="accessType !== 'chPass'"
          prop="username"
          :label="$t('General.userName')"
        >
          <el-input v-model="record.username" :disabled="accessType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item v-if="accessType !== 'chPass'" :label="$t('General.remark')">
          <el-input v-model="record.tag"></el-input>
        </el-form-item>
        <el-form-item v-if="accessType !== 'edit'" prop="password" :label="$t('General.password')">
          <el-input v-model="record.password" type="password"></el-input>
        </el-form-item>
        <div v-if="accessType === 'chPass'">
          <el-form-item prop="newPassword" :label="$t('General.newPassword')">
            <el-input v-model="record.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="repeatPassword" :label="$t('General.confirmPassword')">
            <el-input v-model="record.repeatPassword" type="password"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="closeDialog">{{ $t('Base.cancel') }}</el-button>

        <el-button type="primary" size="small" @click="save" :loading="submitLoading">{{
          accessType == 'create' ? $t('Base.create') : $t('Base.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadUser, createUser, updateUser, destroyUser, changePassword } from '@/api/function'

export default {
  name: 'Users',

  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.record.newPassword) {
        callback(new Error(this.$t('General.confirmNotMatch')))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      tableData: [],
      lockTable: false,
      accessType: '',
      record: {},
      submitLoading: false,
      rules: {
        username: [{ required: true, message: this.$t('General.enterOneUserName') }],
        password: [
          {
            required: true,
            message: this.$t('General.pleaseEnterPassword'),
            trigger: ['blur', 'change'],
          },
          {
            min: 3,
            max: 32,
            message: this.$t('General.passwordLength'),
            trigger: ['blur', 'change'],
          },
        ],
        newPassword: [
          {
            required: true,
            message: this.$t('General.pleaseEnterNewPassword'),
            trigger: ['blur', 'change'],
          },
          {
            min: 3,
            max: 32,
            message: this.$t('General.passwordLength'),
            trigger: ['blur', 'change'],
          },
        ],
        repeatPassword: [
          {
            required: true,
            message: this.$t('General.pleaseEnterAConfirmationPassword'),
          },
          { validator: validatePass, trigger: ['blur', 'change'] },
        ],
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.lockTable = true
      let res = await loadUser().catch(() => {})
      if (res) {
        this.tableData = res
      }
      this.lockTable = false
    },
    showDialog(type = 'create', item = {}) {
      this.dialogVisible = true
      this.$refs?.recordForm?.resetFields()

      if (type === 'edit') {
        this.record = Object.assign({}, item)
        this.accessType = 'edit'
      } else if (type === 'chPass') {
        this.accessType = 'chPass'
        this.record = {
          username: item.username,
          password: '',
          newPassword: '',
          repeatPassword: '',
        }
      } else {
        this.record = {
          username: '',
          tag: '',
          password: '',
        }
        this.accessType = 'create'
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },

    async save() {
      const vue = this
      let validation = await this.$refs.recordForm.validate().catch(() => {})

      if (!validation) {
        return
      }
      this.submitLoading = true
      const { username } = vue.record
      if (vue.accessType === 'edit') {
        updateUser(username, vue.record)
          .then(async () => {
            vue.$message.success(vue.$t('Base.editSuccess'))
            vue.dialogVisible = false
            vue.loadData()
          })
          .finally(() => {
            this.submitLoading = false
          })
      } else if (vue.accessType === 'chPass') {
        let pass = { new_pwd: this.record.newPassword, old_pwd: this.record.password }
        let res = await changePassword(username, pass).catch(() => {})
        if (res) {
          vue.$message.success(vue.$t('General.changePassSuccess'))
          vue.dialogVisible = false
        }
        this.submitLoading = false
      } else {
        createUser(vue.record)
          .then(() => {
            vue.$message.success(vue.$t('General.createUserSuccess'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.record = {}
            vue.loadData()
          })
          .finally(() => {
            this.submitLoading = false
          })
      }
    },
    deleteConfirm(item) {
      const vue = this

      this.$msgbox
        .confirm(this.$t('General.confirmDeleteUser'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          destroyUser(item.username).then(() => {
            vue.$message.success(this.$t('Base.deleteSuccess'))
            vue.loadData()
          })
        })
        .catch(() => {})
    },
  },
}
</script>
