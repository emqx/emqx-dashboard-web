<template>
  <div class="product-details">
    <div class="app-wrapper">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('Products.productOverview')" name="details">
          <a-card>
            <el-row>
              <el-form class="node-form" label-suffix=":" label-position="left" label-width="150px">
                <el-col :span="12">
                  <el-form-item :label="$t('Products.productName')">
                    <span class="form-item-value">{{ data.product_name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="ID">
                    <span class="form-item-value">{{ data.id }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Products.deviceModel')">
                    <span class="form-item-value">{{ data.product_model }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Products.productDes')" class="description">
                    <div class="form-item-value item-block">{{ data.product_desp }}</div>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </a-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.services')" name="services">
          <Service :tab="activeName"></Service>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.models')" name="models">
          <Models :tab="activeName"></Models>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.clients')" name="clients">
          <Clients :tab="activeName"></Clients>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Clients from '../Clients/Clients'
import Models from '../Models/Models'
import Service from '../Service/Service'
import { showProduct } from '@/api/products'

export default {
  name: 'ProductDetails',

  components: {
    Clients,
    Models,
    Service,
  },

  data() {
    return {
      activeName: 'details',
      id: undefined,
      data: {},
    }
  },

  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.loadProductData(this.id)
    }
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
    }
  },

  methods: {
    async loadProductData(id) {
      const data = await showProduct(id)
      this.data = data.items[0]
    },
    handleTabClick(tab) {
      this.activeName = tab.name
    },
  },
}
</script>

<style lang="scss">
.product-details {
  .node-form {
    .description {
      .el-form-item__content {
        line-height: unset;
      }
    }
    .el-form-item {
      margin-bottom: -6px;
    }
    .el-form-item__label {
      color: #666;
    }
    .form-item-value {
      color: #333;
    }
    .item-block {
      margin-top: 8px;
    }
  }
}
</style>
