<template>
  <div class="resource-view">
    <page-header>
      <div class="page-header-title-view">
        <div class="title">
          {{ resourceId }}
        </div>
      </div>

      <div class="page-header-top-start btn">
        <el-button type="danger" size="small" @click="deleteResource">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </page-header>

    <div class="emq-list-body rule-wrapper app-wrapper">
      <!-- 基本信息 -->
      <el-card shadow="never" class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.basicInfo') }}
        </div>

        <ul class="field-info">
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.state') }}:</div>
            <span class="field-value">
              <el-badge :type="isAlive ? 'success' : 'danger'" is-dot>
              </el-badge
              ><span>{{
                isAlive
                  ? $t('RuleEngine.available')
                  : $t('RuleEngine.notAvailable')
              }}</span>
              <el-button
                v-if="!isAlive"
                :loading="reloading"
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
            <span class="field-value"
              >{{ record.typeInfo.title }} ({{ record.type }})</span
            >
          </li>
          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.resourceDes') }}:</div>
            <span class="field-value">{{ record.description }}</span>
          </li>

          <li class="field-info-item">
            <div class="field-title">{{ $t('RuleEngine.instructions') }}:</div>
            <span class="field-value">{{ record.typeInfo.description }}</span>
          </li>

          <li class="field-info-item">
            <div class="field-title">
              {{ $t('RuleEngine.detailedStatus') }}:
            </div>
            <span class="field-value">
              <el-button type="dashed" size="mini" @click="toggleShowConfig">
                {{ showConfig ? $t('RuleEngine.hide') : $t('Base.view') }}
              </el-button>
            </span>
          </li>

          <li v-if="showConfig" class="field-info-item">
            <el-collapse-transition>
              <resource-node :value="record" @change="loadData"></resource-node>
            </el-collapse-transition>
          </li>
        </ul>
      </el-card>

      <el-card shadow="never" class="emq-list-card" :loading="loading">
        <div class="emq-title">
          {{ $t('RuleEngine.configuration') }}
        </div>
        <resource-field :config="record._config"></resource-field>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  loadResourceDetails,
  reconnectResource,
  destroyResource,
} from '@/api/rules'
import ResourceNode from './components/ResourceNode'
import ResourceField from './components/ResourceField'

export default {
  name: 'ResourceView',

  components: { ResourceNode, ResourceField },

  props: {},

  data() {
    return {
      loading: true,
      reloading: false,
      record: {
        _config: [],
        typeInfo: {},
        status: [],
      },
      showConfig: false,
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
      return !status.find(($) => $.is_alive === false)
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
    deleteResource() {
      this.$msgbox
        .confirm(this.$t('RuleEngine.deleteResource'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyResource(this.record.id)
          this.$message.success(this.$t('Base.deleteSuccess'))
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        })
        .catch(() => {})
    },
    toggleShowConfig() {
      this.showConfig = !this.showConfig
    },
    async reconnectResource() {
      this.reloading = true
      reconnectResource(this.resourceId)
        .then(() => {
          this.reloading = false
          this.loadData()
        })
        .catch(() => {
          this.reloading = false
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
  @import './style.scss';

  .field-title {
    width: 110px;
  }
}
</style>
