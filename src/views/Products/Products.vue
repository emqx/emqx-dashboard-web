<template>
  <div class="products">
    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog('create')">
            {{ $t('Base.create') }}
          </el-button>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="product_name" :label="$t('Products.productName')">
            <template slot-scope="{ row }">
              <span class="btn" @click="showDialog('view', row)">
                {{ row.product_name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="product_model" :label="$t('Products.deviceModel')"></el-table-column>
          <el-table-column prop="product_desp" :label="$t('Products.productDes')"></el-table-column>
          <!-- <el-table-column align="right">
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
    </div>

    <el-dialog
      width="520px"
      :title="accessType === 'edit' ? $t('Products.editProduct') : $t('Products.createProduct')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form ref="recordForm" size="small" :model="record" :rules="accessType === 'view' ? {} : rules">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="product_name" :label="$t('Products.productName')">
              <el-input v-model="record.product_name"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="product_model" :label="$t('Products.deviceModel')">
              <el-input v-model="record.product_model"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="product_desp" :label="$t('Products.productDes')">
              <el-input v-model="record.product_desp" type="textarea"></el-input>
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
import { loadProduct, createProduct, updateProduct, destroyProduct } from '@/api/products'

export default {
  name: 'Products',

  components: {},

  props: {},

  data() {
    return {
      dialogVisible: false,
      tableData: [],
      accessType: '',
      record: {},
      rules: {
        product_name: [{ required: true, message: this.$t('Models.isRequired') }],
        product_model: [{ required: true, message: this.$t('Models.isRequired') }],
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
      const data = await loadProduct()
      this.tableData = data.items
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
          product_name: '',
          product_model: '',
          product_desp: '',
        }
        this.dialogVisible = true
      }
    },
    updateProducts(item) {
      updateProduct(item.id, item).then(() => {
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
          const { id } = this.record
          updateProduct(id, record).then(() => {
            this.$message.success(this.$t('General.editorialSuccess'))
            this.dialogVisible = false
            this.accessType = ''
            this.loadData()
          })
        } else {
          createProduct(record).then(() => {
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
        .confirm(this.$t('Products.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(() => {
          destroyProduct(item.id).then(() => {
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
.products {
  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }
}
</style>
