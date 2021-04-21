<template>
  <div class="breadcrumb">
    <el-breadcrumb>
      <el-breadcrumb-item>
        <router-link v-if="backPath" :to="backPath" tag="span" class="btn btn-default raw">
          {{ currentTitle }}
        </router-link>
        <span v-else class="btn btn-default raw">
          {{ currentTitle }}
        </span>
      </el-breadcrumb-item>

      <el-breadcrumb-item v-if="oper">
        <span class="btn btn-default raw">
          {{ oper }}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',

  data() {
    return {
      isIndex: false,
      backPath: undefined,
      currentTitle: '',
      oper: '',
    }
  },

  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },

  created() {
    this.getBreadcrumb()
  },

  methods: {
    getBreadcrumb() {
      const { path, query, name: routeName } = this.$route
      const pathList = path.split('/')
      const name = pathList[1]
      const oper = query.oper || pathList[2]

      // this.isIndex = path === '/monitor'
      this.oper = ''
      this.backPath = undefined
      this.currentTitle = this.$t(`components.${name}`)

      if (['create', 'view', 'detail', 'add', 'select', 'manage'].includes(oper)) {
        this.oper = this.$t(`Base.${oper}`)
        this.backPath = `/${name}`
      } else if (oper === 'node') {
        this.currentTitle = this.$t('Overview.nodeData')
      }
      if (routeName === 'pluginsName' && this.$route.params.pluginName) {
        this.oper = this.$route.params.pluginName
        this.backPath = `/${name}`
      }
    },
  },
}
</script>

<style lang="scss">
.breadcrumb {
  width: 100%;
  margin: 0 0 3px 5px;
}
</style>
