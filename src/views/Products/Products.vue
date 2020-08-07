<template>
  <div class="products">
    <div class="app-wrapper">
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
          <el-table-column prop="name" :label="$t('Products.productName')">
            <template slot-scope="{ row }">
              <span class="btn" @click="showDialog('view', row)">
                {{ row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="deviceModel" :label="$t('Products.deviceModel')"></el-table-column>
          <el-table-column prop="description" :label="$t('Products.productDes')"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">
                {{ $t('General.edit') }}
              </el-button>
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
    </div>

    <el-dialog
      width="600px"
      :title="accessType === 'edit' ? $t('Products.editProduct') : $t('Products.createProduct')"
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
            <el-form-item prop="id" label="ID">
              <el-input
                v-model="record.id"
                :readonly="accessType !== 'create'"
                :disabled="accessType === 'edit'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" :label="$t('Products.productName')">
              <el-input
                v-model="record.name"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="deviceModel" :label="$t('Products.deviceModel')">
              <el-input
                v-model="record.deviceModel"
                :readonly="accessType === 'view'"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="description" :label="$t('Products.productDes')">
              <el-input
                v-model="record.description"
                :readonly="accessType === 'view'"
                type="textarea"
              ></el-input>
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
  // loadApp,
  createApp,
  showApp,
  updateApp,
  destroyAPP,
} from '@/api/function'

export default {
  name: 'Products',

  components: {},

  props: {},

  data() {
    return {
      dialogVisible: false,
      tableData: [
        {
          name: 'test',
          id: 3333,
          deviceModel: '设备型号',
          description: '产品描述描述产品描述描述产品描述描述产品描述描述产品描述',
        },
      ],
      accessType: '',
      record: {},
      rules: {
        name: [{ required: true, message: this.$t('Models.isRequired') }],
        id: [{ required: true, message: this.$t('Models.isRequired') }],
        deviceModel: [{ required: true, message: this.$t('Models.isRequired') }],
        description: [{ required: true, message: this.$t('Models.isRequired') }],
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    clearInput() {
      if (this.$refs.recordForm) {
        this.$refs.recordForm.clearValidate()
      }
    },
    async loadData() {
      // this.tableData = await loadApp()
    },
    // 请求一组数据
    async loadAppData(id) {
      const record = await showApp(id)
      this.record = record
    },
    showDialog(type, item) {
      this.accessType = type
      if (type === 'edit') {
        const record = { ...item }
        this.record = record
        this.dialogVisible = true
      } else if (type === 'view') {
        this.$router.push({
          path: '/products/view',
          query: {
            id: item.id,
          },
        })
      } else {
        this.record = {
          id: Math.random().toString(16).slice(3),
          name: '',
          deviceModel: '',
          description: '',
        }
        this.dialogVisible = true
      }
    },
    updateProducts(item) {
      updateApp(item.id, item).then(() => {
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
        if (vue.accessType === 'edit') {
          const { id } = vue.record
          updateApp(id, record).then(() => {
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
      this.$msgbox.confirm(this.$t('Products.confirmDelete'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(async () => {
        destroyAPP(item.id).then(() => {
          vue.$message.success(this.$t('General.successfulDeletion'))
          vue.loadData()
        })
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss">
.products {

  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
