<template>
  <div class="resource-view">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/" tag="span">
              {{ $t('RuleEngine.homePage') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <router-link class="btn btn-default raw" to="/resources" tag="span">
              {{ $t('RuleEngine.resources') }}
            </router-link>
          </a-breadcrumb-item>


          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ $t('RuleEngine.details') }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            {{ resourceId }}
          </div>
        </div>
      </div>
    </div>


    <div class="emq-list-body rule-wrapper app-wrapper">
      <!-- 基本信息 -->
      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.basicInfo') }}
        </div>


        <ul class="field-info">
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.state') }}:</div>
            <span class="field-value">
              <a-badge
                style="font-size: 12px"
                :status="isAlive ? 'success' : 'error'"
                :text="isAlive ? $t('RuleEngine.available') : $t('RuleEngine.notAvailable')"
                dot
              >
              </a-badge>
              <el-button
                v-if="!isAlive"
                size="mini"
                style="margin-left: 12px"
                type="primary"
                @click="reconnectResource"
              >
                {{ $t('RuleEngine.reconnect') }}
              </el-button>

            </span>
          </li>

          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.resourceTypes') }}:</div>
            <span class="field-value">{{ record.typeInfo.title }} ({{ record.type }})</span>
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.remark') }}:</div>
            <span class="field-value">{{ record.description }}</span>
          </li>

          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.instructions') }}:</div>
            <span class="field-value">{{ record.typeInfo.description }}</span>
          </li>

        </ul>
      </a-card>


      <a-card class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.configuration') }}
        </div>

        <el-row :gutter="40" class="resource-field-wrapper">
          <ul class="field-info">
            <el-col v-for="(item, i) in record._config" :key="i" :span="12">
              <li class="field-info-item" :title="item.description">
                <div class="field-title">{{ item.title }}:</div>
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

  filters: {
    itemValue(val) {
      if (typeof val === 'object') {
        return JSON.stringify(val)
      }
      return val
    },
  },

  props: {},

  data() {
    return {
      loading: true,
      record: {
        _config: [],
        typeInfo: {},
        status: [],
      },
    }
  },
  computed: {
    resourceId() {
      return this.$route.params.id
    },
    isAlive() {
      const { status = [] } = this.record
      if (status.length === 0) {
        return true
      }
      return !status.find($ => $.is_alive === false)
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
