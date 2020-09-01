<template>
  <div class="apps">
    <a-card class="emq-list-card">
      <div class="emq-table-header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog('create')">
          {{ $t('Base.create') }}
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
        <el-table-column prop="app_name" :label="$t('General.appName')"></el-table-column>
        <el-table-column :label="$t('General.isEnabled')">
          <template slot-scope="{ row }">
            <el-switch
              disabled
              v-model="row.app_status"
              active-color="#13ce66"
              inactive-color="#d0d3e0"
              @change="updateApps(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column>
          <template slot-scope="{ row }">
            <el-button type="dashed" size="mini" @click="showDialog('edit', row)">
              {{ $t('General.edit') }}
            </el-button>
            <el-button type="dashed danger" size="mini" @click="deleteConfirm(row)">
              {{ $t('General.delete') }}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </a-card>

    <el-dialog
      width="600px"
      :title="accessType === 'view' ? $t('General.viewApp') : $t('General.createApp')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="accessType === 'view' ? {} : rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="app_id" label="AppID">
              <el-input v-model="record.app_id" :readonly="accessType !== 'create'" :disabled="accessType === 'edit'">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="app_name" :label="$t('General.appName')">
              <el-input v-model="record.app_name" :disabled="accessType === 'edit'" :readonly="accessType === 'view'">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="app_status" :label="$t('General.isEnabled')">
              <emq-select
                v-model="record.app_status"
                :field="{ options: enableOption }"
                :disabled="accessType === 'view'"
              >
              </emq-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="accessType !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="dialogVisible = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadApp, createApp, showApp, updateApp, destroyAPP } from '@/api/apps'

export default {
  name: 'Apps',

  components: {},

  props: {
    tab: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      dialogVisible: false,
      tableData: [],
      accessType: '',
      enableOption: [
        { label: this.$t('General.enabled'), value: 1 },
        { label: this.$t('General.disabled'), value: 0 },
      ],
      record: {
        app_status: true, // 是否启用
      },
      rules: {
        app_name: [{ required: true, message: this.$t('General.pleaseEnterAppName') }],
        app_id: [{ required: true, message: this.$t('General.pleaseEnterTheAppId') }],
        app_status: [{ required: true, message: this.$t('General.pleaseChoose') }],
      },
      switchDic: {
        0: false,
        1: true,
      },
    }
  },

  watch: {
    tab(val) {
      if (val === 'apps') {
        this.loadData()
      }
    },
  },

  methods: {
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    async loadData() {
      const data = await loadApp(this.$route.query.id)
      this.tableData = data.items
    },
    // 请求一组数据
    async loadAppData(id) {
      const record = await showApp(id)
      this.record = record.items[0]
    },
    showDialog(type, item) {
      this.accessType = type
      if (type === 'edit') {
        const record = { ...item }
        this.record = record
      } else if (type === 'view') {
        this.loadAppData(item.id)
      } else {
        this.record = {
          app_id: Math.random().toString(16).slice(3),
          app_status: true,
          product_id: parseInt(this.$route.query.id, 10),
        }
      }
      this.dialogVisible = true
    },
    updateApps(item) {
      updateApp(item.app_id, item).then(() => {
        this.$message.success(this.$t('General.editorialSuccess'))
      })
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (this.accessType === 'edit') {
          const { app_id } = this.record
          updateApp(app_id, record).then(() => {
            this.$message.success(this.$t('General.editorialSuccess'))
            this.dialogVisible = false
            this.accessType = ''
            this.loadData()
          })
        } else {
          createApp(record).then(() => {
            this.$message.success(this.$t('Base.createSuccess'))
            this.dialogVisible = false
            this.accessType = ''
            this.loadData()
          })
        }
      })
    },
    deleteConfirm(item) {
      this.$msgbox
        .confirm(this.$t('General.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(() => {
          destroyAPP(item.app_id).then(() => {
            this.$message.success(this.$t('General.successfulDeletion'))
            this.loadData()
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.apps {
  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
