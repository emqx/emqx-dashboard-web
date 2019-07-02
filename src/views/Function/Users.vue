<template>
  <div class="users">
    <a-card
      class="emq-list-card"
      title="用户列表"
    >
      <div class="emq-table-header">
        <el-button type="primary" @click="createUsers">创建用户</el-button>
      </div>

      <el-table :data="tableData" class="data-list">
        <el-table-column label="跟老的一致" prop="username"></el-table-column>
      </el-table>

    </a-card>


    <el-dialog title="创建用户 或者 编辑用户 你自己维护状态" width="520px" :visible.sync="dialogVisible">
      <el-form :model="record" :rules="rules" size="small">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item prop="name" label="用户名称">
              <el-input v-model="record.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button type="primary" size="small">确定</el-button>
        <el-button plain size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
// API 自行去老 Dashboard 抓包
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
    return {
      dialogVisible: false,
      tableData: [],
      record: {
        newPassword: '',
        password: '123321',
        repeatPassword: '',
        tags: 'viewer',
        username: 'wivwiv',
      },
      rules: {
        username: { required: true },
        password: [{
          required: true,
        }, {
          min: 3,
          max: 32,
          message: '密码长度不符',
        }],
      },
    }
  },

  methods: {
    async loadData() {
      this.tableData = await loadUser()
    },
    createUsers() {
      this.dialogVisible = true
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.users {
}
</style>
