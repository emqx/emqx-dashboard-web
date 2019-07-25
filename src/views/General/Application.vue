<template>
  <div class="application">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              {{ $t('General.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('General.application') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              {{ $t('General.applicationIsCalled') }}
            </p>

            <div class="page-header-link">
              <a :href="docs.restAPI" target="_blank" class="link-item">
                <i class="icon el-icon-document"></i>
                {{ $t('General.productDocumentation') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="showDialog('create')"
          >
            {{ $t('General.create') }}
          </el-button>
        </div>


        <el-table :data="tableData" class="data-list">
          <el-table-column prop="app_id" label="AppID">
            <template slot-scope="{ row }">
              <span class="btn" @click="showDialog('view', row)">
                {{ row.app_id }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('General.appName')"></el-table-column>
          <el-table-column prop="expired" :formatter="formatterExpired" :label="$t('General.expireAt')"></el-table-column>
          <el-table-column prop="desc" :label="$t('General.remark')"></el-table-column>
          <el-table-column :label="$t('General.isEnabled')">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#d0d3e0"
                @change="updateApplication(row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">
                {{ $t('General.edit') }}
              </el-button>
              <el-button
                type="dashed"
                size="mini"
                @click="deleteConfirm(row)"
              >
                {{ $t('General.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>


      </a-card>
    </div>

    <el-dialog
      width="600px"
      :title="accessType === 'edit' ? $t('General.editApp') : $t('General.createApp')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form
        ref="recordForm"
        size="small"
        :model="record"
        :rules="accessType === 'view' ? {} : rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="app_id" label="AppID">
              <el-input
                v-model="record.app_id"
                :readonly="accessType !== 'create'"
                :disabled="accessType === 'edit'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="accessType === 'view'" :span="12">
            <el-form-item prop="secret" :label="$t('General.secret')">
              <el-input
                v-model="record.secret"
                :disabled="accessType === 'edit'"
                :readonly="accessType !== 'create'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" :label="$t('General.appName')">
              <el-input
                v-model="record.name"
                :disabled="accessType === 'edit'"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" :label="$t('General.isEnabled')">
              <emq-select
                v-model="record.status"
                :field="{ options: enableOption }"
                :disabled="accessType === 'view'"
              >
              </emq-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="expired" :label="$t('General.expireAt')">
              <el-date-picker
                v-model="record.expired"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :readonly="accessType === 'view'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="desc" :label="$t('General.remark')">
              <el-input
                v-model="record.desc"
                :readonly="accessType === 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="accessType !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button type="primary" size="small" @click="save">{{ $t('General.confirm') }}</el-button>
        <el-button plain size="small" @click="dialogVisible = false">{{ $t('General.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import moment from 'moment'

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
        restAPI: getLink('restAPI'),
      },
      dialogVisible: false,
      tableData: [],
      accessType: '',
      enableOption: [{ label: this.$t('General.enabled'), value: true }, { label: this.$t('General.disabled'), value: false }],
      record: {
        status: true, // 是否启用
        desc: '',
      },
      rules: {
        name: [{ required: true, message: this.$t('General.pleaseEnterAppName') }],
        app_id: [{ required: true, message: this.$t('General.pleaseEnterTheAppId') }],
        status: [{ required: true, message: this.$t('General.pleaseChoose') }],
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    formatterExpired({ expired }) {
      if (!expired || typeof expired !== 'number') {
        return this.$t('General.neverExpire')
      }
      return moment(expired * 1000).format('YYYY-MM-DD')
    },
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    async loadData() {
      this.tableData = await loadApp()
    },
    // 请求一组数据
    async loadAppData(id) {
      const record = await showApp(id)
      if (record.expired && typeof record.expired === 'number') {
        record.expired = moment(record.expired * 1000).format('YYYY-MM-DD')
      }
      this.record = record
    },
    showDialog(type, item) {
      this.accessType = type
      if (type === 'edit') {
        const record = { ...item }
        if (record.expired && typeof record.expired === 'number') {
          record.expired = moment(record.expired * 1000).format('YYYY-MM-DD')
        } else {
          record.expired = undefined
        }
        this.record = record
      } else if (type === 'view') {
        this.loadAppData(item.app_id)
      } else {
        this.record = {
          app_id: Math.random().toString(16).slice(3),
          status: true,
          desc: '',
        }
      }
      this.dialogVisible = true
    },
    updateApplication(item) {
      updateApp(item.app_id, item).then(() => {
        this.$message.success(this.$t('General.editorialSuccess'))
      })
    },
    save() {
      const vue = this
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (record.expired && typeof record.expired === 'string') {
          try {
            record.expired = Math.floor(new Date(record.expired).getTime() / 1000)
          } catch (e) {
            record.expired = null
          }
        }
        if (vue.accessType === 'edit') {
          const { app_id } = vue.record
          updateApp(app_id, record).then(() => {
            vue.$message.success(this.$t('General.editorialSuccess'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.loadData()
          })
        } else {
          createApp(record).then(() => {
            vue.$message.success(this.$t('General.successfulAppCreation'))
            vue.dialogVisible = false
            vue.accessType = ''
            vue.loadData()
          })
        }
      })
    },
    deleteConfirm(item) {
      const vue = this
      this.$msgbox.confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('General.confirm'),
        cancelButtonText: this.$t('General.cancel'),
        type: 'warning',
      }).then(async () => {
        destroyAPP(item.app_id).then(() => {
          vue.$message.success(this.$t('General.successfulDeletion'))
          vue.loadData()
        })
      }).catch(() => {})
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
