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
          <el-table-column prop="productName" :label="$t('Products.productName')">
            <template slot-scope="{ row }">
              <span class="btn" @click="showDialog('view', row)">
                {{ row.productName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="productID" label="ID"> </el-table-column>
          <el-table-column prop="productModel" :label="$t('Products.deviceModel')"></el-table-column>
          <el-table-column prop="description" :label="$t('Products.productDes')"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">
                {{ $t('General.edit') }}
              </el-button>
              <el-button type="dashed danger" size="mini" @click="deleteConfirm(row)">
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
      <el-form ref="recordForm" size="small" :model="record" :rules="accessType === 'view' ? {} : rules">
        <el-row :gutter="20">
          <el-col v-if="accessType !== 'create'" :span="12">
            <el-form-item prop="productID" label="ID">
              <el-input v-model="record.productID" :disabled="accessType === 'edit'"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productName" :label="$t('Products.productName')">
              <el-input v-model="record.productName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productModel" :label="$t('Products.deviceModel')">
              <el-input v-model="record.productModel"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="description" :label="$t('Products.productDes')">
              <el-input v-model="record.description" type="textarea"></el-input>
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
      tableData: [
        {
          productID: 'aaa111',
          productName: 'device',
          productModel: 'product-01',
          description: 'xxxxx',
        },
      ],
      accessType: '',
      record: {},
      rules: {
        productName: [{ required: true, message: this.$t('Models.isRequired') }],
        productID: [{ required: true, message: this.$t('Models.isRequired') }],
        productModel: [{ required: true, message: this.$t('Models.isRequired') }],
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
      this.tableData = await loadProduct()
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
            id: item.productID,
          },
        })
      } else {
        this.record = {
          productName: '',
          productModel: '',
          description: '',
        }
        this.dialogVisible = true
      }
    },
    updateProducts(item) {
      updateProduct(item.productID, item).then(() => {
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
          const { productID } = this.record
          updateProduct(productID, record).then(() => {
            this.$message.success(this.$t('General.editorialSuccess'))
            this.dialogVisible = false
            this.accessType = ''
            this.loadData()
          })
        } else {
          createProduct(record).then(() => {
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
        .confirm(this.$t('Products.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(() => {
          destroyProduct(item.productID).then(() => {
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
