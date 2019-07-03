<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="plugin-view">
    <div class="page-header">
      <div class="page-header-content">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link to="/" tag="span" class="btn btn-default raw">
              首页
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <router-link to="/plugins" tag="span" class="btn btn-default raw">
              插件
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <span class="btn btn-default raw">
              {{ node }}
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="page-header-title-view">
          <div class="title">
            {{ $route.params.name }}
          </div>
        </div>

        <div class="page-header-content-view">
          <div class="content">
            <p class="description">
              该功能仅做调试使用，配置将在 Broker 重启后将丢失，请将配置写入相应配置文件
            </p>
          </div>
        </div>

      </div>
    </div>

    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-title">配置信息</div>

        <el-form ref="record" :model="record" size="small" :rules="rules" label-position="top">
          <el-row :gutter="20">
            <el-col v-for="(item, i) in fieldList" :span="item.span" :key="i">
              <el-form-item v-bind="item.formItem">
                <el-input v-if="item.type !== 'number'" v-model="record[item.key]" v-bind="item.inputItem"></el-input>

                <el-input v-else v-model.number="record[item.key]" v-bind="item.inputItem"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="line" style="margin: 20px auto;background-color: #d8d8d8"></div>
        <div class="footer">
          <el-button size="medium" type="primary" :disabled="!changed" @click="updateConfig">保存</el-button>
          <el-button size="medium" @click="handleCache">取消</el-button>
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

  methods: {
    async updateConfig() {
      this.$refs.record.validate(async (valid) => {
        if (!valid) {
          return
        }
        await updatePlugin(this.node, this.$route.params.name)
        this.$message.success('更新成功')
        this.$router.go(-1)
      })
    },
    handleCache() {
      if (this.changed) {
        this.$msgbox.confirm('你的更改将不被保存，确认继续？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
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
        const { key, value, desc, required } = item
        this.$set(this.record, key, value)
        list.push(this.getFieldItem(item))
      })
      this.oldConfig = JSON.stringify(this.record)
      this.fieldList = list.filter($ => $.type !== 'textarea')
      const otherField = list.filter($ => $.type === 'textarea')
      otherField.sort(($1, $2) => $1.order > $2.order ? 1 : -1)
      this.fieldList.concat(otherField)
    },
    getFieldItem(item) {
      const { key, desc, required } = item
      let { value } = item
      let type = value.length > 28 ? 'textarea' : 'text'

      if (typeof value === 'number' || (value && /^[0-9]*$/.test(value))) {
        type = 'number'
        value = parseInt(value)
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
          rules: required ? { required: true, message: '请输入' } : {},
        },
        inputItem: {
          type,
          placeholder: value,
          rows: 4,
        },
      }
    },
  },

  created() {
    this.loadData()
  },

  computed: {
    node() {
      return this.$route.query.node
    },
    changed() {
      return this.oldConfig !== JSON.stringify(this.record)
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
