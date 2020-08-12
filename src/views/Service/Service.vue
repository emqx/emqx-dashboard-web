<template>
  <div class="services">
    <a-card class="emq-list-card">
      <div class="emq-table-header">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="showDialog('create')"
        >
          {{ $t('Base.create') }}
        </el-button>
      </div>

      <el-table :data="tableData" class="data-list">
        <el-table-column prop="name" :label="$t('Services.name')">
          <template slot-scope="{ row }">
            <span class="btn" @click="showDialog('view', row)">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('Services.remark')"></el-table-column>
        <el-table-column prop="type" :label="$t('Services.type')"></el-table-column>
        <el-table-column prop="topic" :label="$t('Services.topic')"></el-table-column>
        <el-table-column>
          <template slot-scope="{ row }">
            <el-button
              type="dashed danger"
              size="mini"
              @click="deleteConfirm(row)"
            >
              {{ $t('General.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </a-card>

    <el-dialog
      width="600px"
      :title="$t('General.createApp')"
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
            <el-form-item prop="name" :label="$t('Services.name')">
              <el-input
                v-model="record.name"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="remark" :label="$t('Services.remark')">
              <el-input
                v-model="record.remark"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="topic" :label="$t('Services.topic')">
              <el-input
                v-model="record.topic"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="type" :label="$t('Services.type')">
              <el-select
                v-model="record.type"
                :readonly="accessType === 'view'"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
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
import {
  showApp,
  destroyAPP,
} from '@/api/function'

export default {
  name: 'Services',

  components: {},

  props: {},

  data() {
    return {
      dialogVisible: false,
      tableData: [],
      accessType: '',
      record: {},
      rules: {
        name: [{ required: true, message: this.$t('Models.isRequired') }],
        remark: [{ required: true, message: this.$t('Models.isRequired') }],
        type: [{ required: true, message: this.$t('Models.isRequired') }],
        topic: [{ required: true, message: this.$t('Models.isRequired') }],
      },
      typeList: [
        { label: this.$t('Services.post'), value: 0 },
        { label: this.$t('Services.send'), value: 1 },
      ],
    }
  },

  created() {
    // this.loadData()
  },

  methods: {
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    // async loadData() {
    //   this.tableData = await loadApp()
    // },
    // 请求一组数据
    async loadAppData(id) {
      const record = await showApp(id)
      this.record = record
    },
    showDialog(type, item) {
      this.accessType = type
      if (type === 'view') {
        this.loadAppData(item.app_id)
      } else {
        this.record = {}
      }
      this.dialogVisible = true
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return false
        }
        return true
        // const record = { ...this.record }
      })
    },
    deleteConfirm(item) {
      const vue = this
      this.$msgbox.confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        destroyAPP(item.app_id).then(() => {
          vue.$message.success(this.$t('General.successfulDeletion'))
          // vue.loadData()
        })
      }).catch(() => {})
    },
  },
}
</script>

<style lang="scss">
.services {
  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
