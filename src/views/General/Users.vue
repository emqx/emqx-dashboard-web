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
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            :disabled="notAbleChange"
            @click="showDialog('create')"
          >
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column min-width="120px" prop="username" :label="$t('General.userName')"></el-table-column>
          <el-table-column min-width="120px" prop="role" :label="$t('General.role')">
            <template slot-scope="{ row }">
              {{ getLabelFromOpts(row.role, roleOpts) }}
            </template>
          </el-table-column>
          <el-table-column min-width="60px" prop="tags" :label="$t('General.remark')" />
          <el-table-column width="120px">
            <template slot-scope="{ row }">
              <el-button
                type="dashed"
                size="mini"
                :disabled="!isCurrentUser(row.username) && notAbleChange"
                @click="showDialog('edit', row)"
              >
                {{ $t('Base.edit') }}
              </el-button>
              <el-button
                v-if="!isCurrentUser(row.username)"
                type="danger"
                size="mini"
                :disabled="notAbleChange"
                @click="deleteConfirm(row)"
              >
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>

    <el-dialog
      width="520px"
      custom-class="user-dialog"
      :title="accessType === 'edit' ? $t('General.editorUser') : $t('General.creatingUser')"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      :show-close="!isForChangeDefaultPwd"
      :close-on-click-modal="!isForChangeDefaultPwd"
      :close-on-press-escape="!isForChangeDefaultPwd"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules" :validate-on-rule-change="false">
        <el-form-item prop="username" :label="$t('General.userName')">
          <el-input v-model="record.username" :disabled="accessType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item prop="role" :label="$t('General.role')">
          <el-select v-model="record.role" :disabled="notAbleChange">
            <el-option
              class="opt-role"
              v-for="{ label, value, desc } in roleOpts"
              :key="value"
              :value="value"
              :label="label"
            >
              <span>{{ label }}</span>
              <el-tooltip effect="dark" :content="desc">
                <i class="iconfont icon-bangzhu"></i>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tags" :label="$t('General.remark')">
          <el-input v-model="record.tags" :disabled="notAbleChange"></el-input>
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
        <el-link
          v-if="accessType === 'edit' && !isForChangeDefaultPwd && !notAbleChange"
          :underline="false"
          @click="togglePassword"
        >
          {{ allowChange ? $t('General.dontChangePassword') : $t('General.changePassword') }}
        </el-link>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="closeDialog" v-if="!isForChangeDefaultPwd">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="!isCurrentUser(record.username) && notAbleChange"
          @click="save"
        >
          {{ $t('Base.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadUser, createUser, updateUser, destroyUser, changePassword } from '@/api/function'
import changeDefaultPwd from '@/mixins/changeDefaultPwd'
import pwdRule from '@/common/pwdRule'
import { ROLE_MAP } from '@/common/constants'
import { getLabelFromOpts } from '@/common/utils'

export default {
  name: 'Users',

  components: {},

  mixins: [changeDefaultPwd],

  props: {
    /**
     * from route
     */
    isForChangeDefaultPwd: {
      type: Boolean,
    },
  },

  data() {
    const roleOpts = [
      { label: this.$t('General.admin'), value: ROLE_MAP.Administrator, desc: this.$t('General.adminDesc') },
      { label: this.$t('General.viewer'), value: ROLE_MAP.Viewer, desc: this.$t('General.viewerDesc') },
    ]
    return {
      roleOpts,
      dialogVisible: false,
      tableData: [],
      accessType: '',
      allowChange: false,
      record: {
        username: '',
        tags: '',
        role: '',
      },
    }
  },

  computed: {
    currentUserName() {
      return this.$store.state.user.username
    },
    rules() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('General.pleaseEnterYourPasswordAgain')))
        } else if (value !== this.record.newPassword) {
          callback(new Error(this.$t('General.confirmNotMatch')))
        } else {
          callback()
        }
      }
      const newPwdSameConfirm = (rule, value, callback) => {
        if (value === this.record.password) {
          callback(new Error(this.$t('General.noSameNewPwd')))
        } else {
          callback()
        }
      }
      const { newPassword, repeatPassword } = pwdRule(validatePass)
      const ret = {
        username: [{ required: true, message: this.$t('General.enterOneUserName') }],
        role: [{ required: true, message: this.$t('General.roleRequired') }],
        password: [
          {
            required: true,
            message: this.$t('General.pleaseEnterPassword'),
            trigger: ['blur', 'change'],
          },
        ],
        newPassword: [
          ...newPassword,
          {
            validator: newPwdSameConfirm,
            trigger: ['blur'],
          },
        ],
        repeatPassword,
      }
      // when is create
      if (this.accessType !== 'edit') {
        ret.password.push({
          pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[ -~]{8,64}$/,
          message: this.$t('General.passwordRequirement'),
          trigger: ['blur'],
        })
      }
      return ret
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

  beforeRouteLeave(to, from, next) {
    this.preventLeaveWithoutChangeDefaultPwd(to, from, next)
  },
  beforeRouteUpdate(to, from, next) {
    this.preventLeaveWithoutChangeDefaultPwd(to, from, next)
  },

  methods: {
    getLabelFromOpts,
    async loadData() {
      this.tableData = await loadUser()
    },
    showDialog(type, item) {
      this.accessType = 'create'
      if (type === 'edit') {
        this.record = { ...item }
        this.accessType = 'edit'
        if (this.notAbleChange) {
          this.allowChange = true
        }
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
        this.record = { username: '', tags: '', role: '' }
      }, 500)
    },
    togglePassword() {
      this.allowChange = !this.allowChange
      // 取消修改密码，删除密码数据
      if (!this.allowChange) {
        this.record = {
          tags: this.record.tags,
          username: this.record.username,
          role: this.record.role,
        }
      }
    },
    isCurrentUser(username) {
      return this.$store.state.user.username === username
    },
    submitNewUser() {
      createUser(this.record).then(() => {
        this.$message.success(this.$t('General.createUserSuccess'))
        this.dialogVisible = false
        this.accessType = ''
        this.loadData()
      })
    },
    submitNewPwd() {
      const { username } = this.record
      const passwordData = {
        new_pwd: this.record.newPassword,
        old_pwd: this.record.password,
      }
      return changePassword(username, passwordData)
    },
    updateCurrentUser() {
      const { username, role } = this.record
      if (this.isCurrentUser(username)) {
        // 更新当前用户
        if (this.allowChange) {
          this.$store.dispatch('UPDATE_USER_INFO', { username, password: this.record.newPassword, role })
        } else {
          this.$store.commit('UPDATE_USER_ROLE', role)
        }
        if (this.isForChangeDefaultPwd) {
          this.$router.replace({ query: { _t: Date.now().toString().slice(-2) } })
        }
      }
    },
    async save() {
      try {
        await this.$refs.recordForm.validate()
        if (this.accessType !== 'edit') {
          this.submitNewUser()
          return
        }
        const { username } = this.record
        if (!this.notAbleChange) {
          await updateUser(username, this.record)
        }
        if (this.allowChange) {
          await this.submitNewPwd()
        }
        this.updateCurrentUser()
        this.$message.success(this.$t('Base.editSuccess'))
        this.dialogVisible = false
        this.allowChange = false
        this.accessType = ''
        this.loadData()
      } catch (error) {
        // eslint-disable-next-line consistent-return
        return false
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

<style lang="scss">
.user-dialog {
  .el-select {
    width: 100%;
  }
}
.opt-role {
  .icon-bangzhu {
    margin-left: 4px;
  }
}
</style>
