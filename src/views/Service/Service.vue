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
        <el-table-column prop="serviceName" :label="$t('Services.name')">
          <template slot-scope="{ row }">
            <span class="btn" @click="showDialog('view', row)">
              {{ row.serviceName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceID" label="ID"></el-table-column>
        <el-table-column prop="serviceType" :label="$t('Services.type')">
          <template slot-scope="scope">
            <span>{{ typeDic[scope.row.type] }}</span>
          </template>
        </el-table-column>
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
            <el-form-item prop="serviceName" :label="$t('Services.name')">
              <el-input
                v-model="record.serviceName"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="serviceID" label="ID">
              <el-input
                v-model="record.serviceID"
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
            <el-form-item prop="serviceType" :label="$t('Services.type')">
              <el-select
                v-model="record.serviceType"
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
import { createService, destroyService, loadService } from '@/api/services'

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
        serviceName: [{ required: true, message: this.$t('Models.isRequired') }],
        serviceID: [{ required: true, message: this.$t('Models.isRequired') }],
        serviceType: [{ required: true, message: this.$t('Models.isRequired') }],
        topic: [{ required: true, message: this.$t('Models.isRequired') }],
      },
      typeList: [
        { label: this.$t('Services.post'), value: 1 },
        { label: this.$t('Services.send'), value: 2 },
      ],
      typeDic: {
        1: this.$t('Services.post'),
        2: this.$t('Services.send'),
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
      this.tableData = await loadService()
    },
    showDialog(type, item) {
      this.accessType = type
      if (type === 'view') {
        this.record = item
      } else {
        this.record = {
          serviceID: Math.random().toString(16).slice(3),
          serviceName: '',
          serviceType: '',
          topic: '',
          productID: this.id,
        }
      }
      this.dialogVisible = true
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        createService(record).then(() => {
          this.$message.success(this.$t('General.successfulAppCreation'))
          this.dialogVisible = false
          this.accessType = ''
          this.loadData()
        })
      })
    },
    deleteConfirm(item) {
      this.$msgbox.confirm(this.$t('General.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(() => {
        destroyService(item.serviceID).then(() => {
          this.$message.success(this.$t('General.successfulDeletion'))
          this.loadData()
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
