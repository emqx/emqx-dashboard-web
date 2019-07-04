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
          <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="showDialog('create')">创 建</el-button>
        </div>


        <el-table :data="tableData" class="data-list">
          <el-table-column label="应用ID" prop="app_id"></el-table-column>
          <el-table-column label="应用名称" prop="name"></el-table-column>
          <el-table-column label="到期时间" prop="expired"></el-table-column>
          <el-table-column label="备注" prop="desc"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#d0d3e0"
                @change="updateApplication(row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('view', row)">查看</el-button>
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">编辑</el-button>
              <el-button
                type="dashed"
                size="mini"
                @click="deleteConfirm(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


      </a-card>
    </div>

    <el-dialog
      width="600px"
      :title="accessType === 'edit' ? '编辑应用' : '创建应用'" 
      :visible.sync="dialogVisible">
      <el-form size="small" ref="recordForm" :model="record" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="app_id" label="应用ID" >
              <el-input
                v-model="record.app_id"
                :disabled="accessType !== 'create'"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="accessType === 'view'" :span="12">
            <el-form-item prop="secret" label="密钥" >
              <el-input v-model="record.secret" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="应用名称" >
              <el-input
                v-model="record.name"
                :disabled="accessType !== 'create'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" label="状态" >
              <el-select
                v-model="record.status"
                :disabled="accessType === 'view'">
                <el-option label="启用" :value="true"></el-option>
                <el-option label="不启用" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="expired" label="到期时间" >
              <el-date-picker
                v-model="record.expired"
                type="date"
                value-format="yyyy-MM-dd"
                :disabled="accessType === 'view'">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="desc" label="备注" >
              <el-input
                v-model="record.desc"
                :disabled="accessType === 'view'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="accessType !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button type="primary" size="small" @click="save">确定</el-button>
        <el-button plain size="small" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
// API 自行去老 Dashboard 抓包
import {
  loadApp,
  createApp,
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
      accessType: '',
      record: {
        name: 'wivwiv', // 应用名称
        app_id: '7a9984c29896b', // 应用 ID
        status: true, // 是否启用
        expired: 0, // 到期时间 秒时间错 显示需要格式化为 年月日
        secret: 'Mjg4MTQ0NjgwNDQ2MDEwMDkyMzIwNzgzNTI1ODAwODM3MTC', // 密钥 自动生成 [查看可见]
        desc: '', // 描述
      },
      rules: {
        name: [ { required: true, message: '请输入应用名称' } ],
        app_id: [ { required: true, message: '请输入应用 ID' } ],
        status: [ { required: true, message: '请选择是否启用' } ],
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
    // 请求一组数据
    async loadAppData(id) {
      this.record = await showApp(id)
    },
    showDialog(type, item) {
      this.record = {}
      this.accessType = type
      if (type === 'edit') {
        this.record = item
      }
      if (type === 'view') {
        this.loadAppData(item.app_id)
      }
      this.dialogVisible = true
    },
    updateApplication(item) {
      updateApp(item.app_id, item).then(() => {
        this.$message.success('编辑成功')
      })
    },
    save() {
      const vue = this
      this.$refs.recordForm.validate(function(valid) {
        if (!valid) {
          return false
        }
        if (vue.accessType === 'edit') {
          const { app_id } = vue.record
          updateApp(app_id, vue.record).then(() => {
            vue.$message.success('编辑成功')
            vue.dialogVisible = false
            vue.accessType = ''
            vue.record = {}
            vue.loadData()
          })
        } else {
          createApp(vue.record).then(() => {
            vue.$message.success('创建应用成功')
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
      this.$confirm('确定删除该应用?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        destroyAPP(item.app_id).then(() => {
          vue.$message.success('删除成功')
          vue.loadData()
        })
      })
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
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>
