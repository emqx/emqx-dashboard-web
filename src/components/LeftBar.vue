<template>
  <div class="left-bar" :style="{ width: leftBarCollapse ? '80px' : '200px' }">
    <el-menu :default-active="defaultSelectedKeys" :collapse="leftBarCollapse" class="menu-bgColor" router>
      <template v-for="menu in menus">
        <template v-if="$hasShow(menu.key)">
          <el-menu-item :key="menu.path" :index="menu.path" :style="{ paddingLeft: leftBarCollapse ? '30px' : '20px' }">
            <i :class="['iconfont', menu.icon]"></i>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'LeftBar',

  props: {},

  data() {
    return {
      menus: [],
      defaultOpenKeys: [],
    }
  },

  computed: {
    leftBarCollapse() {
      return this.$store.state.leftBarCollapse
    },
    defaultSelectedKeys() {
      const { path } = this.$route
      return `/${path.split('/')[1]}`
    },
    logoStyle() {
      return { left: !this.$store.state.leftBarCollapse ? 0 : '-200px' }
    },
  },

  watch: {
    $route() {
      this.initRouter()
    },
    leftBarCollapse(val) {
      if (val) {
        this.defaultOpenKeys = []
      } else {
        this.initRouter()
      }
    },
  },

  created() {
    this.menus = [
      {
        title: this.$t('components.monitor'),
        path: '/monitor',
        key: 'monitor',
        icon: 'icon-yibiaopan',
      },
      {
        title: this.$t('components.usersAcl'),
        path: '/users_and_acl',
        key: 'usersAcl',
        icon: 'icon-kongjian',
      },
      {
        title: this.$t('components.clients'),
        path: '/clients',
        icon: 'icon-guanlianshebei',
      },
      {
        title: this.$t('components.topics'),
        path: '/topics',
        icon: 'icon-zuzhiqunzu',
      },
      {
        title: this.$t('components.subscriptions'),
        path: '/subscriptions',
        icon: 'icon-shebeiguanli',
      },
      {
        title: this.$t('components.ruleengine'),
        key: 'rules',
        icon: 'icon-guizeyinqing',
        path: '/ruleengine',
        // children: [
        //   {
        //     title: this.$t('components.rule'),
        //     key: 'rules.ruleEngine',
        //     path: '/rules',
        //     parentKey: 'rules',
        //   },
        //   {
        //     title: this.$t('components.resources'),
        //     key: 'rules.resources',
        //     path: '/resources',
        //     parentKey: 'rules',
        //   },
        //   {
        //     title: this.$t('components.schemas'),
        //     key: 'rules.schema',
        //     path: '/schemas',
        //     parentKey: 'rules',
        //   },
        // ],
      },
      {
        title: this.$t('components.modules'),
        key: 'modules',
        path: '/modules',
        icon: 'icon-changjingguanli',
      },
      {
        title: this.$t('components.alerts'),
        key: 'alerts',
        path: '/alerts',
        icon: 'icon-gaojing',
      },
      {
        title: this.$t('components.tools'),
        key: 'tools',
        icon: 'icon-gongju',
        path: '/tools',
        // children: [
        //   {
        //     title: 'WebSocket',
        //     key: 'tool.WebSocket',
        //     path: '/websocket',
        //     parentKey: 'tools',
        //   },
        // ],
      },
      {
        title: this.$t('components.setting'),
        key: 'setting',
        path: '/setting',
        icon: 'icon-icon_shezhi',
      },
      {
        title: this.$t('components.general'),
        key: 'general',
        icon: 'icon-fenzuguanli',
        path: '/general',
        // children: [
        //   {
        //     title: this.$t('components.application'),
        //     key: 'general.application',
        //     path: '/application',
        //     parentKey: 'general',
        //   },
        //   {
        //     title: this.$t('components.users'),
        //     key: 'general.user',
        //     path: '/users',
        //     parentKey: 'general',
        //   },
        //   {
        //     title: this.$t('components.blacklist'),
        //     key: 'general.blacklist',
        //     path: '/blacklist',
        //     parentKey: 'general',
        //   },
        //   {
        //     title: this.$t('components.backup'),
        //     key: 'general.backup',
        //     path: '/backup',
        //     parentKey: 'general',
        //   },
        //   {
        //   title: this.$t('components.plugins'),
        //   key: 'plugins',
        //   path: '/plugins',
        //   icon: 'icon-kongjian',
        // },
        //   // {
        //   //   title: this.$t('components.trace'),
        //   //   key: 'general.trace',
        //   //   path: '/trace',
        //   //   parentKey: 'general',
        //   // },
        // ],
      },
    ]
    this.initRouter()
  },

  methods: {
    handleClick(e) {
      this.$router.push({ path: e.key })
    },
    titleClick() {},
    initRouter() {
      if (this.leftBarCollapse) {
        return
      }
      const { path } = this.$route
      this.menus.forEach((item) => {
        if (!item.key || !item.children) {
          return
        }
        if (item.children.find(($) => path.includes($.path) || path === $.path)) {
          if (!this.defaultOpenKeys.includes(item.key)) {
            this.defaultOpenKeys.push(item.key)
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '../assets/style/variables';

.left-bar {
  min-height: calc(100vh - 60px);
  background-color: $color-theme;
  transition: all 0.3s;
  // margin-top: 60px;

  .menu-bgColor {
    background-color: $color-theme;
    border-right: 1px solid $color-theme;
  }
  .el-scrollbar {
    height: 100vh;
  }

  .el-menu--collapse {
    width: 80px;
  }

  .el-menu-item {
    color: #ddd;
    & span {
      padding-left: 20px;
    }
    &:hover,
    &:focus,
    &.is-active {
      background-color: #00000075;
    }
  }

  // .menu-text {
  //   padding-left: 10px;
  // }
}
</style>
