<template>
  <div class="services">
    <a-card class="emq-list-card">
      <div class="emq-table-header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog('create')">
          {{ $t('Base.create') }}
        </el-button>
      </div>

      <el-table :data="tableData" class="data-list">
        <el-table-column prop="service_name" :label="$t('Services.name')">
          <template slot-scope="{ row }">
            <span class="btn" @click="showDialog('view', row)">
              {{ row.service_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="service_type" :label="$t('Services.type')">
          <template slot-scope="scope">
            <span>{{ typeDic[scope.row.service_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="topic" :label="$t('Services.topic')"></el-table-column>
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

    <el-dialog width="600px" :title="dialogTitle" :visible.sync="dialogVisible" @close="clearInput">
      <el-form ref="recordForm" size="small" :model="record" :rules="accessType === 'view' ? {} : rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="service_name" :label="$t('Services.name')">
              <el-input v-model="record.service_name" :readonly="accessType === 'view'"> </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="accessType !== 'create'" :span="12">
            <el-form-item prop="id" label="ID">
              <el-input v-model="record.id" :readonly="accessType === 'view'" :disabled="accessType === 'edit'">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="topic" :label="$t('Services.topic')">
              <el-input v-model="record.topic" :readonly="accessType === 'view'"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="service_type" :label="$t('Services.type')">
              <el-select v-model="record.service_type" :readonly="accessType === 'view'">
                <el-option v-for="(item, index) in typeList" :key="index" :value="item.value" :label="item.label">
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
import { createService, destroyService, loadService, updateService, showService } from '@/api/services'

export default {
  name: 'Services',

  components: {},

  props: {
    tab: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      tableData: [],
      accessType: '',
      record: {},
      product_id: undefined,
      rules: {
        service_name: [{ required: true, message: this.$t('Models.isRequired') }],
        id: [{ required: true, message: this.$t('Models.isRequired') }],
        service_type: [{ required: true, message: this.$t('Models.isRequired') }],
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

  watch: {
    tab(val) {
      if (val === 'services') {
        this.loadData()
      }
    },
  },

  created() {
    this.product_id = this.$route.query.id
  },

  methods: {
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.resetFields()
      }
    },
    async loadData() {
      const data = await loadService(this.product_id)
      this.tableData = data.items
    },
    async showDialog(type, item) {
      this.accessType = type
      if (type === 'view') {
        this.dialogTitle = this.$t('Services.viewService')
        const data = await showService(item.id)
        this.record = data.items[0]
      } else if (type === 'create') {
        this.dialogTitle = this.$t('Services.createService')
        this.record = {
          service_name: '',
          service_type: '',
          topic: '',
          product_id: this.product_id,
        }
      } else {
        this.dialogTitle = this.$t('Services.editService')
        const record = { ...item }
        this.record = record
      }
      this.dialogVisible = true
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (this.accessType === 'edit') {
          const { id } = this.record
          updateService(id, record).then(() => {
            this.$message.success(this.$t('General.editorialSuccess'))
            this.dialogVisible = false
            this.accessType = ''
            this.loadData()
          })
        } else {
          createService(record).then(() => {
            this.$message.success(this.$t('General.successfulAppCreation'))
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
          destroyService(item.id).then(() => {
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
.services {
  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
