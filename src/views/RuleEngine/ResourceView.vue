<template>
  <div class="resource-view">
    <a-card class="detail-title-wrapper">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/resources' }">资源列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ resourceId }}

        </el-breadcrumb-item>
      </el-breadcrumb>
    </a-card>


    <div class="emq-list-body rule-wrapper">
      <!-- 基本信息 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          基本信息
        </div>


        <ul class="field-info">
          <li class="field-info-item">
            <div class="field-title">状态：</div>
            <span class="field-value">
              <a-badge
                style="font-size: 12px"
                :status="record.status.is_alive ? 'success' : 'error'"
                :text="record.status.is_alive ? '可用' : '不可用'"
                dot
              >
            </a-badge>
              <el-button
                v-if="!record.status.is_alive"
                size="mini"
                style="margin-left: 12px"
                type="primary"
                @click="reconnectResource">
                重连
              </el-button>

            </span>
          </li>

          <li class="field-info-item">
            <div class="field-title">资源类型：</div>
            <span class="field-value">{{ record.typeInfo.title }} ({{ record.type }})</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">备注：</div>
            <span class="field-value">{{ record.description }}</span>
          </li>

          <li class="field-info-item">
            <div class="field-title">使用说明：</div>
            <span class="field-value">{{ record.typeInfo.description }}</span>
          </li>

        </ul>
      </a-card>


      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          配置信息
        </div>

        <el-row :gutter="40" class="resource-field-wrapper">
          <ul class="field-info">
            <el-col v-for="(item, i) in record._config" :key="i" :span="12">
              <li class="field-info-item" :title="item.description">
                <div class="field-title">{{ item.title }}：</div>
                <span class="field-value">{{ item.value | itemValue }}</span>
              </li>
            </el-col>
          </ul>
        </el-row>

      </a-card>

    </div>


  </div>
</template>


<script>
import { loadResourceDetails, reconnectResource } from '@/api/rules'

export default {
  name: 'ResourceView',

  components: {},

  props: {},

  data() {
    return {
      loading: true,
      record: {
        _config: [],
        typeInfo: {},
        status: {},
      },
    }
  },

  filters: {
    itemValue(val) {
      if (typeof val === 'object') {
        return JSON.stringify(val)
      }
      return val
    },
  },

  watch: {
    $route() {
      this.loadData()
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async reconnectResource() {
      reconnectResource(this.resourceId).then(() => {
        this.loadData()
      })
    },
    async loadData() {
      try {
        this.record = await loadResourceDetails(this.resourceId)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
  },
  computed: {
    resourceId() {
      return this.$route.params.id
    },
  },
}
</script>


<style lang="scss">
.resource-view {
  @import "./style.less";

  .field-title {
    width: 80px;
  }

  .ant-badge-status-text {
    font-size: 12px;
  }

  .resource-field-wrapper {
    .field-title {
      width: 140px;
    }
  }
}
</style>
