<template>
  <div class="models">
    <a-card class="emq-list-card">
      <div class="emq-table-header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog('create')">
          {{ $t('Base.create') }}
        </el-button>
      </div>
      <el-table :data="tableData" class="data-list">
        <el-table-column prop="thing_name" :label="$t('Models.modelName')"></el-table-column>
        <el-table-column prop="service_name" :label="$t('Services.name')"></el-table-column>
        <el-table-column prop="service_id" :label="$t('Models.serviceID')"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <!-- <el-table-column>
          <template slot-scope="{ row }">
            <el-button type="dashed danger" size="mini" @click="deleteConfirm(row)">
              {{ $t('General.delete') }}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </a-card>

    <el-dialog width="520px" :title="dialogTitle" :visible.sync="dialogVisible" @close="clearInput">
      <el-form ref="recordForm" size="small" :model="record" :rules="accessType === 'view' ? {} : rules">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('Models.modelName')" prop="thing_name">
              <el-select v-model="record.thing_name" :disabled="accessType === 'view'">
                <el-option v-for="(item, index) in modelList" :key="index" :value="item" :label="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="service_id" :label="$t('Services.name')">
              <el-select v-model="record.service_id" :disabled="accessType === 'view'">
                <el-option
                  v-for="(item, index) in serviceData"
                  :key="index"
                  :value="item.id"
                  :label="item.service_name"
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
import { loadModel, destroyModel, showModel, createModel } from '@/api/models'
import { loadService } from '@/api/services'

export default {
  name: 'Models',

  components: {},

  props: {
    tab: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      tableData: [],
      dialogTitle: '',
      record: {},
      dialogVisible: false,
      accessType: '',
      rules: {
        thing_name: [{ required: true, message: this.$t('Models.isRequired') }],
        service_id: [{ required: true, message: this.$t('Models.isRequired') }],
      },
      serviceData: [],
      modelList: [
        this.$t('Models.downTest'),
        this.$t('Models.upTest'),
        this.$t('Models.downSend'),
        this.$t('Models.upSend'),
        this.$t('Models.downControl'),
        this.$t('Models.upControl'),
        this.$t('Models.reportData'),
      ],
    }
  },

  watch: {
    tab(val) {
      if (val === 'models') {
        this.loadServiceData(this.$route.query.id)
        this.loadData(this.$route.query.id)
      }
    },
  },

  created() {
    if (this.$route.query.tab && this.$route.query.tab === 'models') {
      this.loadData()
    }
  },

  methods: {
    async loadServiceData(id) {
      const data = await loadService(id)
      this.serviceData = data.items
    },
    async loadData() {
      const data = await loadModel(this.$route.query.id)
      this.tableData = data.items
      this.tableData.forEach((item) => {
        this.serviceData.forEach((one) => {
          if (item.service_id === one.id) {
            item.service_name = one.service_name
          }
        })
      })
    },
    deleteConfirm(item) {
      this.$msgbox
        .confirm(this.$t('Models.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(() => {
          destroyModel(item.id).then(() => {
            this.$message.success(this.$t('General.successfulDeletion'))
            this.loadData()
          })
        })
        .catch(() => {})
    },
    clearInput() {
      if (this.$refs.recordForm) {
        this.record = {}
        this.$refs.recordForm.resetFields()
      }
    },
    async showDialog(type, item) {
      this.accessType = type
      if (type === 'view') {
        this.dialogTitle = this.$t('Models.viewModel')
        const data = await showModel(item.id)
        this.record = data.items[0]
      } else if (type === 'create') {
        this.dialogTitle = this.$t('Models.createModel')
      }
      this.dialogVisible = true
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        record.thing_code = this.modelList.indexOf(this.record.thing_name) + 1
        createModel(record).then(() => {
          this.$message.success(this.$t('Base.createSuccess'))
          this.dialogVisible = false
          this.accessType = ''
          this.loadData()
        })
      })
    },
  },
}
</script>

<style lang="scss">
.models {
  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
