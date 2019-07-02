<template>
  <div class="application">
    <a-card
      class="emq-list-card"
      title="应用列表"
    >
      <div class="emq-table-header">
        <el-button type="primary" @click="createApplication">创建应用</el-button>
      </div>


      <el-table :data="tableData" class="data-list">
        <el-table-column label="跟老的一致" prop="name"></el-table-column>
      </el-table>


    </a-card>


    <el-dialog title="创建应用 或者 编辑应用 你自己维护状态" width="520px" :visible.sync="dialogVisible">
      <el-form :model="record" :rules="rules" size="small">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item prop="name" label="应用名称">
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
  loadApp,
  crateApp,
  showApp,
  updateApp,
  destroyAPP,
} from '@/api/function'

export default {
  name: 'Application',

  components: {},

  props: {},

  data() {
    return {
      dialogVisible: false,
      tableData: [],
      record: {
        'name': 'wivwiv', // 应用名称
        'app_id': '7a9984c29896b', // 应用 ID
        'status': true, // 是否启用
        'expired': 0, // 到期时间 秒时间错 显示需要格式化为 年月日
        'secret': 'Mjg4MTQ0NjgwNDQ2MDEwMDkyMzIwNzgzNTI1ODAwODM3MTC', // 密钥 自动生成 [查看可见]
        'desc': '', // 描述
      },
      rules: {
        name: { required: true },
        status: [{ required: true }, { type: 'enum', enum: [0, 1] }],
      },
    }
  },

  methods: {
    async loadData() {
      this.tableData = await loadApp()
    },
    createApplication() {
      this.dialogVisible = true
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.application {
}
</style>
