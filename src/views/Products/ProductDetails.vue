<template>
  <div class="product-details">
    <div class="app-wrapper">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="$t('Products.productOverview')" name="details">
          <a-card>
            <el-row>
              <el-form
                class="node-form"
                label-suffix=":"
                label-position="left"
                label-width="150px"
              >
                <el-col :span="12">
                  <el-form-item :label="$t('Products.productName')">
                    <span class="form-item-value">{{ data.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="ID">
                    <span class="form-item-value">{{ data.id }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Products.deviceModel')">
                    <span class="form-item-value">{{ data.deviceModel }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Products.productDes')" class="description">
                    <div class="form-item-value item-block">{{ data.description }}</div>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </a-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.services')" name="services">
          <Service></Service>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.models')" name="models">
          <Models v-if="id" :id="id"></Models>
          <Models v-else></Models>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.clients')" name="clients">
          <Clients v-if="id" :id="id"></Clients>
          <Clients v-else></Clients>
        </el-tab-pane>
        <el-tab-pane :label="$t('components.apps')" name="apps">
          <Apps></Apps>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
import Clients from '../Clients/Clients'
import Models from '../Models/Models'
import Apps from '../Apps/Apps'
import Service from '../Service/Service'


export default {
  name: 'ProductDetails',

  components: {
    Clients,
    Models,
    Apps,
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
      this.id = parseInt(this.$route.query.id, 10)
    }
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
    }
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
