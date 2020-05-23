<template>
  <div class="nav-tabs" :style="{ left: !$store.state.leftBarCollapse ? '201px' : '80px' }">
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container">
      <el-button
        plain
        size="mini"
        :class="{ active: isIndex }"
        @click="$router.push('/')"
      >
        {{ $t('Base.homePage') }}
      </el-button>
      <el-button
        v-for="(tab, index) in tabs"
        :key="index"
        plain
        size="mini"
        :class="{ active: tab.url === currentUrl }"
        @click="navTab(tab)"
      >
        <template v-if="tab.name === 'node'">
          {{ tab.url | getNodeName }}
        </template>
        <template v-else-if="tab.name === 'clientid'">
          {{ tab.url | getClientId }}
        </template>
        <template
          v-else-if="tab.name === 'ruleId' || tab.name === 'resourceId' || tab.name === 'schemaName'"
        >
          {{ tab.url | getParamsId }}
        </template>
        <template v-else>
          {{ $t(`components.${tab.name}`) }}
        </template>
        <a class="btn-close" href="javascript:;" @click.stop="closeTab(tab)">
          <i class="el-icon-close"></i>
        </a>
      </el-button>
    </el-scrollbar>
  </div>
</template>


<script>
import { getParamValue } from '@/common/utils'

export default {
  name: 'NavTabs',

  components: {},

  filters: {
    getNodeName(url) {
      return getParamValue(url, 'name')
    },
    getClientId(url) {
      return getParamValue(url, 'clientid')
    },
    getParamsId(url) {
      const path = url.split('?')[0]
      return path.split('/')[2]
    },
  },

  data() {
    return {
      isIndex: true,
      isActive: false,
    }
  },

  computed: {
    tabs() {
      return this.$store.state.navTabs
    },
    currentUrl() {
      return this.$route.fullPath
    },
  },

  watch: {
    $route() {
      this.loadTabs()
    },
  },

  created() {
    this.loadTabs()
  },

  methods: {
    getTabName(name, oper) {
      if (name === 'monitor' && oper === 'node') {
        return 'node'
      }
      if (name === 'rules' && oper === 'create') {
        return 'ruleCreate'
      }
      if (name === 'schemas' && oper === 'create') {
        return 'schemaCreate'
      }
      return name
    },
    loadTabs() {
      const { path, fullPath, query } = this.$route
      const pathList = path.split('/')
      let name = pathList[1]
      const oper = query.oper || pathList[2]

      this.isIndex = path === '/monitor'
      if (this.isIndex) {
        return
      }
      name = this.getTabName(name, oper)
      const tabIndex = this.tabs.findIndex($ => $.url === fullPath || $.name === name)
      if (tabIndex === -1) {
        const tab = { name, url: fullPath }
        this.$store.dispatch('ADD_NAV_TABS', tab)
      }
    },
    navTab(tab) {
      this.$router.push({ path: tab.url })
    },
    closeTab(tab) {
      this.$store.dispatch('REMOVE_NAV_TABS', tab).then((res) => {
        const isActive = tab.url === this.currentUrl
        if (!isActive) {
          return
        }
        const last = res.length - 1
        let path = '/'
        if (last !== -1) {
          path = res[last].url
        }
        this.$router.push({ path })
      })
    },
  },
}
</script>


<style lang="scss">
.nav-tabs {
  position: fixed;
  width: auto;
  padding: 0 24px;
  top: 50px;
  right: 0;
  left: 200px;
  height: 30px;
  line-height: 30px;
  background: #fcfcfc;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .1);
  z-index: 100;
  transition: all .3s;
  .el-button {
    min-width: 50px;
    transition: all .3s;
    &.active,
    &.active:hover,
    &.active:focus {
      border-color: #34C388;
      color: #fff;
      background: #34C388;
      .btn-close {
        color: #fff;
      }
    }
    .btn-close {
      color: #606266;
      transition: all .3s;
      border-radius: 50%;
      display: inline-block;
      width: 13px;
      height: 13px;
      text-align: center;
      line-height: 13px;
      i {
        transform: scale(0.6);
        position: relative;
        top: 1px;
      }
      &:hover {
        background: #afafaf;
        color: #fff;
      }
    }
  }
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    .el-scrollbar__bar.is-horizontal {
      display: none;
    }
    .el-scrollbar:hover > .el-scrollbar__bar,
    .el-scrollbar:active > .el-scrollbar__bar,
    .el-scrollbar:focus > .el-scrollbar__bar {
      opacity: 0;
    }
  }
}
</style>
