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
      <a-card class="emq-list-card">
        <code-editor
          v-model="modelData"
          class="model-data"
          lang="application/json"
          :lint="false"
          :disabled="true"
        ></code-editor>
      </a-card>
    </div>
  </div>
</template>


<script>
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'ModelView',

  components: {
    CodeEditor,
  },

  data() {
    return {
      modelData: '',
    }
  },
  methods: {
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
