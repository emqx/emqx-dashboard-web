<template>
  <div class="users">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              {{ $t('Function.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('Function.user') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            {{ $t('Function.user') }}
          </div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            {{ $t('Function.manageDashboardUsers') }}
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
      >
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="showDialog('create')"
          >
            {{ $t('Function.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column min-width="120px" prop="username" :label="$t('Function.userName')"></el-table-column>
          <el-table-column min-width="60px" prop="tags" :label="$t('Function.remark')"></el-table-column>
          <el-table-column width="120px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">{{ $t('Function.edit') }}</el-button>


              <el-button
                v-if="row.tags !== 'administrator' && row.username !== 'admin'"
                type="danger"
                size="mini"
                @click="deleteConfirm(row)"
              >{{ $t('Function.delete') }}
              </el-button>

            </template>
          </el-table-column>
        </el-table>

      </a-card>
    </div>


    <el-dialog
      width="520px"
      :title="accessType === 'edit' ? $t('Function.editorUser') : $t('Function.creatingUser')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="rules">
        <el-form-item prop="username" :label="$t('Function.userName')">
          <el-input
            v-model="record.username"
            :disabled="accessType === 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item prop="tags" :label="$t('Function.remark')">
          <el-input v-model="record.tags"></el-input>
        </el-form-item>
        <el-form-item
          v-if="accessType !== 'edit' || allowChange"
          prop="password"
          :label="accessType === 'edit' ? $t('Function.oldPassword') : $t('Function.password')"
        >
          <el-input v-model="record.password" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="allowChange" prop="newPassword" :label="$t('Function.newPassword')">
          <el-input v-model="record.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="allowChange" prop="repeatPassword" :label="$t('Function.confirmPassword')">
          <el-input v-model="record.repeatPassword" type="password"></el-input>
        </el-form-item>
        <el-link
          v-if="accessType === 'edit'"
          :underline="false"
          @click="togglePassword"
        >
          {{ allowChange ? $t('Function.dontChangePassword') : $t('Function.changePassword') }}
        </el-link>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button type="primary" size="small" @click="save">{{ $t('Function.confirm') }}</el-button>
        <el-button plain size="small" @click="closeDialog">{{ $t('Function.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  loadUser,
  createUser,
  updateUser,
  destroyUser,
  changePassword,
} from '@/api/function'

export default {
  name: 'Users',

  components: {},

  props: {},

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Function.pleaseEnterYourPasswordAgain')))
      } else if (value !== this.record.newPassword) {
        callback(new Error('两次输入密码不一致!'))
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
        username: [
          { required: true, message: this.$t('Function.enterOneUserName') },
        ],
        tags: [
          { required: true, message: this.$t('Function.pleaseEnterNotes') },
        ],
        password: [{
          required: true,
          message: this.$t('Function.pleaseEnterPassword'),
          trigger: ['blur', 'change'],
        }, {
          min: 3,
          max: 32,
          message: '密码长度为三到三十二位',
          trigger: ['blur', 'change'],
        }],
        newPassword: [{
          required: true,
          message: this.$t('Function.pleaseEnterNewPassword'),
          trigger: ['blur', 'change'],
        }, {
          min: 3,
          max: 32,
          message: '密码长度为三到三十二位',
          trigger: ['blur', 'change'],
        }],
        repeatPassword: [
          { required: true, message: this.$t('Function.pleaseEnterAConfirmationPassword.') },
          { validator: validatePass, trigger: ['blur', 'change'] },
        ],
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    async loadData() {
      this.tableData = await loadUser()
    },
    showDialog(type, item) {
      this.record = {}
      this.accessType = 'create'
      if (type === 'edit') {
        this.record = item
        this.accessType = 'edit'
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.allowChange = false
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
      const vue = this
      this.$refs.recordForm.validate(function (valid) {
        if (!valid) {
          return false
        }
        if (vue.accessType === 'edit') {
          const { username } = vue.record
          updateUser(username, vue.record).then(async () => {
            if (vue.allowChange) {
              const passwordData = {
                new_pwd: vue.record.newPassword,
                old_pwd: vue.record.password,
              }
              await changePassword(username, passwordData)
            }
            vue.$message.success(this.$t('Function.editorialSuccess'))
            vue.dialogVisible = false
            vue.allowChange = false
            vue.accessType = ''
            vue.record = {}
            vue.loadData()
          })
        } else {
          createUser(vue.record).then(() => {
            vue.$message.success(this.$t('Function.createUserSuccess'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.record = {}
            vue.loadData()
          })
        }
      })
    },
    deleteConfirm(item) {
      const vue = this

      this.$msgbox.confirm('确定删除该用户?', {
        confirmButtonText: this.$t('Function.confirm'),
        cancelButtonText: this.$t('Function.cancel'),
        type: 'warning',
      }).then(async () => {
        destroyUser(item.username).then(() => {
          vue.$message.success(this.$t('Function.successfulDeletion'))
          vue.loadData()
        })
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss">
.users {
}
</style>
