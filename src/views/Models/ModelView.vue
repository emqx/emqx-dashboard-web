<template>
  <div class="model">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          <p class="description" v-html="$t('Models.modelDescription')">
            {{ $t('Models.modelDescription') }}
          </p>
          <p class="description copy-tip">
            {{ $t('Models.copyTip') }}
          </p>
          <div class="copy-button">
            <el-button
              v-clipboard:cpoy="modelData"
              v-clipboard:success="copySuccessed"
              type="primary"
              size="small"
              class="add-model-button"
            >
              {{ $t('Models.copyModel') }}
            </el-button>
          </div>
        </div>
      </div>
    </page-header>
    <div class="app-wrapper">
      <el-card class="emq-list-card">
        <div :style="{ height: height + 'px' }">
          <monaco :id="`modelView${modelID}`" v-model="modelData" lang="json"> </monaco>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { showModel } from '@/api/models'
import Monaco from '@/components/Monaco'

export default {
  name: 'ModelView',

  components: {
    Monaco,
  },

  data() {
    return {
      modelData: '',
      modelID: 0,
      height: 500,
    }
  },

  created() {
    this.height = document.body.clientHeight - 280
    this.modelID = this.$route.query.modelId
    this.loadData(this.$route.query.modelId)
  },

  methods: {
    async loadData(modelID) {
      await showModel(modelID)
        .then((res) => {
          const { thing_name, thing_desp, data_type, id, service_id, properties } = res.items[0]
          const params = {
            ModelInfo: {
              id,
              thing_name,
              thing_desp,
              data_type,
              service_id,
            },
            properties: JSON.parse(properties),
          }
          this.modelData = JSON.stringify(params, null, 2)
        })
        .catch()
    },
    copySuccessed() {
      this.$message.success(this.$t('Base.copied'))
    },
  },
}
</script>

<style lang="scss">
.model {
  .content {
    position: relative;
  }

  .copy-button {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .description {
    max-width: unset;
    width: 100%;
  }

  .copy-tip {
    margin-top: 5px;
  }
}
</style>
