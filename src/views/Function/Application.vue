<template>
  <div class="application">
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
              应用
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            应用
          </div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              应用为调用 REST API 认证凭证，通过 REST API 可查询、调整 EMQ X 集群信息，对设备进行管理操作
            </p>

            <div class="page-header-link">
              <a :href="docs.restAPI" target="_blank" class="link-item">
                <i class="icon el-icon-document"></i>
                产品文档
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card
        class="emq-list-card"
      >
        <div class="emq-table-header">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="createApplication">创 建</el-button>
        </div>


        <el-table :data="tableData" class="data-list">
          <el-table-column label="跟老的一致" prop="name"></el-table-column>
        </el-table>


      </a-card>
    </div>


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
        <el-button type="primary" size="small">确 定</el-button>
        <el-button plain size="small">取 消</el-button>
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
import { getLink } from '@/common/utils'

export default {
  name: 'Application',

  components: {},

  props: {},

  data() {
    return {
      docs: {
        restAPI: getLink('ruleEngineTutorial'),
      },
      dialogVisible: false,
      tableData: [],
      record: {
        name: 'wivwiv', // 应用名称
        app_id: '7a9984c29896b', // 应用 ID
        status: true, // 是否启用
        expired: 0, // 到期时间 秒时间错 显示需要格式化为 年月日
        secret: 'Mjg4MTQ0NjgwNDQ2MDEwMDkyMzIwNzgzNTI1ODAwODM3MTC', // 密钥 自动生成 [查看可见]
        desc: '', // 描述
      },
      rules: {
        name: { required: true },
        status: [{ required: true }, { type: 'enum', enum: [0, 1] }],
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.tableData = await loadApp()
    },
    createApplication() {
      this.dialogVisible = true
    },
  },
}
</script>


<style lang="scss">
.application {
  .link-item {
    .icon {
      width: 24px;
      height: 24px;
      line-height: 14px;
      border-radius: 50%;
      border: 1px solid #34C388;
      padding: 4px;
      text-align: center;
      margin-right: 8px;
      font-size: 12px;
    }
  }
}
</style>
