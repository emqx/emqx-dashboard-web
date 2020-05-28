<template>
  <div class="breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link to="/" tag="span" class="btn btn-default raw">
          {{ $t('Base.homePage') }}
        </router-link>
      </a-breadcrumb-item>

      <template v-if="!isIndex">
        <a-breadcrumb-item>
          <router-link v-if="backPath" :to="backPath" tag="span" class="btn btn-default raw">
            {{ currentTitle }}
          </router-link>
          <span v-else class="btn btn-default raw">
            {{ currentTitle }}
          </span>
        </a-breadcrumb-item>

        <a-breadcrumb-item v-if="oper">
          <span class="btn btn-default raw">
            {{ oper }}
          </span>
        </a-breadcrumb-item>
      </template>

    </a-breadcrumb>
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
      const {
        path, query, name: routeName,
      } = this.$route
      const pathList = path.split('/')
      const name = pathList[1]
      const oper = query.oper || pathList[2]

      this.isIndex = path === '/monitor'
      this.oper = ''
      this.backPath = undefined
      this.currentTitle = this.$t(`components.${name}`)

      if (['create', 'view', 'detail'].includes(oper)) {
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
