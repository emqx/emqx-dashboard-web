<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="plugin-view">
    <page-header
      :back-title="$t('Plugins.plugin')"
      :oper="node"
      back-path="/plugins"
    >
      <div class="page-header-title-view">
        <div class="title">
          {{ $route.params.name }}
        </div>
      </div>

      <div class="page-header-content-view">
        <div class="content">
          <p class="description">
            {{ $t('Plugins.pluginTips') }}
          </p>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-title">{{ $t('Plugins.configuration') }}</div>

        <el-form ref="record" :model="record" size="small" :rules="rules" label-position="top">
          <el-row :gutter="20">
            <el-col v-for="(item, i) in fieldList" :key="i" :span="item.span">
              <el-form-item v-bind="item.formItem">
                <el-input v-if="item.type !== 'number'" v-model="record[item.key]" v-bind="item.inputItem"></el-input>

                <el-input v-else v-model.number="record[item.key]" v-bind="item.inputItem"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="line" style="margin: 20px auto;background-color: #d8d8d8"></div>
        <div class="footer">
          <el-button size="medium" @click="handleCache">{{ $t('Plugins.cancel') }}</el-button>
          <el-button size="medium" type="primary" :disabled="!changed" @click="updateConfig">{{ $t('Plugins.save') }}</el-button>
        </div>
      </a-card>
    </div>

  </div>
</template>


<script>
import { loadPluginDetail, updatePlugin } from '@/api/common'

export default {
  name: 'PluginView',

  components: {},

  props: {},

  data() {
    return {
      config: [],
      record: {},
      rules: {},
      fieldList: [],
      oldConfig: '',
    }
  },

  computed: {
    node() {
      return this.$route.query.node
    },
    changed() {
      return this.oldConfig !== JSON.stringify(this.record)
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    async updateConfig() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        await updatePlugin(this.node, this.$route.params.name)
        this.$message.success(this.$t('Plugins.updateSuccessful'))
        this.$router.go(-1)
      })
    },
    handleCache() {
      if (this.changed) {
        this.$msgbox.confirm(this.$t('Plugins.pluginBeforeSaveTips'), {
          confirmButtonText: this.$t('Plugins.confirm'),
          cancelButtonText: this.$t('Plugins.cancel'),
          type: 'warning',
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {})
      } else {
        this.$router.go(-1)
      }
    },
    async loadData() {
      this.config = await loadPluginDetail(this.node, this.$route.params.name)
      this.fillData()
    },
    fillData() {
      this.record = {}
      this.fieldList = []
      const list = []
      this.config.forEach((item) => {
        const { key, value } = item
        this.$set(this.record, key, value)
        list.push(this.getFieldItem(item))
      })
      this.oldConfig = JSON.stringify(this.record)
      this.fieldList = list.filter($ => $.type !== 'textarea')
      const otherField = list.filter($ => $.type === 'textarea')
      otherField.sort(($1, $2) => ($1.order > $2.order ? 1 : -1))
      this.fieldList.concat(otherField)
    },
    getFieldItem(item) {
      const { key, required } = item
      let { value } = item
      let type = value.length > 28 ? 'textarea' : 'text'

      if (typeof value === 'number' || (value && /^[0-9]*$/.test(value))) {
        type = 'number'
        value = parseInt(value, 10)
      }

      let order = key.length

      if (type === 'textarea') {
        order += 100
      }

      return {
        key,
        span: type === 'textarea' ? 12 : 12,
        type,
        order,
        formItem: {
          label: key,
          rules: required ? { required: true, message: this.$t('Plugins.pleaseEnter') } : {},
        },
        inputItem: {
          type,
          placeholder: value,
          rows: 4,
        },
      }
    },
  },
}
</script>


<style lang="scss">
.plugin-view {
  .footer {
    margin-top: 24px;
    text-align: center;
  }

  .emq-title {
    margin-bottom: 40px;
  }
}
</style>
