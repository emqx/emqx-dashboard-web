<template>
  <div class="breadcrumb">
    <a-breadcrumb>
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
      <a-breadcrumb-item v-else>
        <router-link :to="{ name: 'monitor' }" tag="span" class="btn btn-default raw">
          {{ $t('components.monitor') }}
        </router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
import { isSubApp } from '../common/forToBeSubApp.js'
import { getPathForEmqxDashBoardPage } from '../common/utils.js'

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
      const name = isSubApp ? pathList[8] : pathList[1]
      const oper = query.oper || (isSubApp ? pathList[9] : pathList[2])
      if (isSubApp) {
        const subAppPre = `/${path.split('/')[8]}`
        this.isIndex = subAppPre === '/monitor'
      } else {
        this.isIndex = path === '/monitor'
      }
      this.oper = ''
      this.backPath = undefined
      this.currentTitle = this.$t(`components.${name}`)

      if (['create', 'view', 'detail', 'add', 'select', 'manage'].includes(oper)) {
        this.oper = this.$t(`Base.${oper}`)
        this.backPath = getPathForEmqxDashBoardPage(path, `/${name}`)
      } else if (oper === 'node') {
        this.currentTitle = this.$t('Overview.nodeData')
      }
      if (routeName === 'pluginsName' && this.$route.params.pluginName) {
        this.oper = this.$route.params.pluginName
        this.backPath = getPathForEmqxDashBoardPage(path, `/${name}`)
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
