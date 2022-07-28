<template>
  <div class="users">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('General.manageDashboardUsers') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog('create')">
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column min-width="120px" prop="username" :label="$t('General.userName')"></el-table-column>
          <el-table-column min-width="60px" prop="tags" :label="$t('General.remark')"></el-table-column>
          <el-table-column width="120px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">{{ $t('Base.edit') }} </el-button>
              <el-button
                v-if="row.tags !== 'administrator' && row.username !== 'admin'"
                type="danger"
                size="mini"
                @click="deleteConfirm(row)"
                >{{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>

    <el-dialog
      width="520px"
      :title="accessType === 'edit' ? $t('General.editorUser') : $t('General.creatingUser')"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      :show-close="!isForChangeDefaultPwd"
      :close-on-click-modal="!isForChangeDefaultPwd"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-form-item prop="username" :label="$t('General.userName')">
          <el-input v-model="record.username" :disabled="accessType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item prop="tags" :label="$t('General.remark')">
          <el-input v-model="record.tags"></el-input>
        </el-form-item>
        <el-form-item
          v-if="accessType !== 'edit' || allowChange"
          prop="password"
          :label="accessType === 'edit' ? $t('General.oldPassword') : $t('General.password')"
        >
          <el-input v-model="record.password" type="password" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item v-if="allowChange" prop="newPassword" :label="$t('General.newPassword')">
          <el-input v-model="record.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="allowChange" prop="repeatPassword" :label="$t('General.confirmPassword')">
          <el-input v-model="record.repeatPassword" type="password"></el-input>
        </el-form-item>
        <el-link v-if="accessType === 'edit' && !isForChangeDefaultPwd" :underline="false" @click="togglePassword">
          {{ allowChange ? $t('General.dontChangePassword') : $t('General.changePassword') }}
        </el-link>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="closeDialog" v-if="!isForChangeDefaultPwd">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadUser, createUser, updateUser, destroyUser, changePassword } from '@/api/function'
import pwdRule from '@/common/pwdRule'

export default {
  name: 'Users',

  components: {},

  props: {
    /**
     * from route
     */
    isForChangeDefaultPwd: {
      type: Boolean,
    },
  },

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('General.pleaseEnterYourPasswordAgain')))
      } else if (value !== this.record.newPassword) {
        callback(new Error(this.$t('General.confirmNotMatch')))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      tableData: [],
      accessType: '',
      allowChange: false,
      record: {},
      rules: {
        username: [{ required: true, message: this.$t('General.enterOneUserName') }],
        tags: [{ required: true, message: this.$t('General.pleaseEnterNotes') }],
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
        ...pwdRule(validatePass),
      },
    }
  },

  computed: {
    currentUserName() {
      return this.$store.state.user.username
    },
  },

  watch: {
    isForChangeDefaultPwd(val) {
      if (val) {
        this.openChangePwdDialog()
      }
    },
  },

  async created() {
    await this.loadData()
    this.confirmForChangeDefaultPwdParam()
  },

  methods: {
    async loadData() {
      this.tableData = await loadUser()
    },
    showDialog(type, item) {
      this.accessType = 'create'
      if (type === 'edit') {
        Object.assign(this.record, item)
        this.accessType = 'edit'
      }
      this.dialogVisible = true
      if (this.$refs.recordForm) {
        this.$refs.recordForm.clearValidate()
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.allowChange = false
      if (this.$refs.recordForm) {
        this.$refs.recordForm.clearValidate()
      }
      window.setTimeout(() => {
        this.record = { username: '', tags: '' }
      }, 500)
    },
    togglePassword() {
      this.allowChange = !this.allowChange
      // 取消修改密码，删除密码数据
      if (!this.allowChange) {
        this.record = {
          tags: this.record.tags,
          username: this.record.username,
        }
      }
    },
    async save() {
      /* eslint-disable */
      const vue = this
      this.$refs.recordForm.validate(function (valid) {
        if (!valid) {
          return false
        }
        if (vue.accessType === 'edit') {
          const { username, password } = vue.record
          updateUser(username, vue.record).then(async () => {
            if (vue.allowChange) {
              const passwordData = {
                new_pwd: vue.record.newPassword,
                old_pwd: vue.record.password,
              }
              await changePassword(username, passwordData)
              // 更新当前用户
              if (vue.$store.state.user.username === username) {
                vue.$store.dispatch('UPDATE_USER_INFO', { username, password: vue.record.newPassword })
                if (vue.isForChangeDefaultPwd) {
                  vue.$router.replace({ name: 'users', query: {} })
                }
              }
            }
            vue.$message.success(vue.$t('Base.editSuccess'))
            vue.dialogVisible = false
            vue.allowChange = false
            vue.accessType = ''
            vue.loadData()
          })
        } else {
          createUser(vue.record).then(() => {
            vue.$message.success(vue.$t('General.createUserSuccess'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.loadData()
          })
        }
      })
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
    /**
     * open when user using default pwd
     */
    openChangePwdDialog() {
      try {
        const user = this.tableData.find(({ username }) => username === this.currentUserName)
        if (!user) {
          throw new Error('User not found')
        }
        this.showDialog('edit', user)
        this.allowChange = true
      } catch (error) {
        console.error(error)
      }
    },
    confirmForChangeDefaultPwdParam() {
      if (this.isForChangeDefaultPwd) {
        this.openChangePwdDialog()
      }
    },
  },
}
</script>
