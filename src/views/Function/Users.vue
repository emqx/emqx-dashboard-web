<template>
  <div class="users">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              首页
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              用户
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            用户
          </div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            管理大师登录用户
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
            @click="showDialog('create')">
            创建
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column min-width="120px" prop="username" label="用户名"></el-table-column>
          <el-table-column min-width="60px" prop="tags" label="备注"></el-table-column>
          <el-table-column width="120px">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">编辑</el-button>


              <el-button
                v-if="row.tags !== 'administrator' && row.username !== 'admin'"
                type="danger"
                size="mini"
                @click="deleteConfirm(row)">删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>

      </a-card>
    </div>


    <el-dialog
      width="520px"
      :title="accessType === 'edit' ? '编辑用户' : '创建用户'"
      @close="clearInput"
      :visible.sync="dialogVisible">
      <el-form size="small" ref="recordForm" :model="record" :rules="rules">
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="record.username"
            :disabled="accessType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item prop="tags" label="备注">
          <el-input v-model="record.tags"></el-input>
        </el-form-item>
        <el-form-item
          v-if="accessType !== 'edit' || allowChange"
          prop="password"
          :label="accessType === 'edit' ? '旧密码' : '密码'">
          <el-input v-model="record.password" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="allowChange" prop="newPassword" label="新密码">
          <el-input v-model="record.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="allowChange" prop="repeatPassword" label="确认新密码">
          <el-input v-model="record.repeatPassword" type="password"></el-input>
        </el-form-item>
        <el-link
          v-if="accessType === 'edit'"
          :underline="false"
          @click="togglePassword">
          {{ allowChange ? '不修改密码' : '修改密码' }}
        </el-link>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button type="primary" size="small" @click="save">确定</el-button>
        <el-button plain size="small" @click="closeDialog">取消</el-button>
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
        callback(new Error('请再次输入密码'))
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
          { required: true, message: '请输入用户名' },
        ],
        tags: [
          { required: true, message: '请输入备注' },
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: ['blur', 'change'],
        }, {
          min: 3,
          max: 32,
          message: '密码长度为三到三十二位',
          trigger: ['blur', 'change'],
        }],
        newPassword: [{
          required: true,
          message: '请输入新密码',
          trigger: ['blur', 'change'],
        }, {
          min: 3,
          max: 32,
          message: '密码长度为三到三十二位',
          trigger: ['blur', 'change'],
        }],
        repeatPassword: [
          { required: true, message: '请输入确认密码' },
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
      this.$refs.recordForm.validate(function(valid) {
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
            vue.$message.success('编辑成功')
            vue.dialogVisible = false
            vue.allowChange = false
            vue.accessType = ''
            vue.record = {}
            vue.loadData()
          })
        } else {
          createUser(vue.record).then(() => {
            vue.$message.success('创建用户成功')
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
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        destroyUser(item.username).then(() => {
          vue.$message.success('删除成功')
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
