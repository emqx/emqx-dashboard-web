<template>
  <div class="left-bar" :style="{ width: leftBarCollapse ? '80px' : '200px' }">
    <div class="logo">
      <img class="logo-img" src="../assets/emqx_logo.png" alt="logo" />
      <div class="title">Dashboard</div>
    </div>

    <a-menu
      class="menu-wrapper"
      :default-selected-keys="defaultSelectedKeys"
      :selected-keys="defaultSelectedKeys"
      :open-keys.sync="defaultOpenKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="leftBarCollapse"
      @click="handleClick"
    >
      <template v-for="item in menus">
        <template v-if="$hasShow(item.key)">
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.key" @titleClick="titleClick(item)">
            <span slot="title">
              <icon-font :type="item.icon"></icon-font>
              <span>{{ item.title }}</span>
            </span>
            <template v-for="item2 in item.children">
              <a-menu-item v-if="$hasShow(item2.key)" :key="item2.path">
                {{ item2.title }}
              </a-menu-item>
            </template>
          </a-sub-menu>

          <a-menu-item v-else-if="!item.children && $hasShow(item.key)" :key="item.path">
            <icon-font :type="item.icon"></icon-font>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
import 'ant-design-vue/lib/menu/style'
import { getLink } from '@/common/utils'
import store from '@/stores'

export default {
  name: 'LeftBar',

  components: {
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.ItemGroup.name]: Menu.ItemGroup,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Menu.Divider.name]: Menu.Divider,
  },

  props: {},

  data() {
    return {
      menus: [],
      defaultOpenKeys: [],
      docs: {
        cloudHelp: getLink('cloudHelp'),
        docs: '',
      },
      fromCloud: false,
    }
  },

  computed: {
    leftBarCollapse() {
      return this.$store.state.leftBarCollapse
    },
    defaultSelectedKeys() {
      const { path } = this.$route
      return [`/${path.split('/')[1]}`]
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
    if (store.state.config.baseURL === '/dashboard') {
      this.fromCloud = true
    }
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
        title: this.$t('components.rules'),
        key: 'rules',
        icon: 'icon-guizeyinqing',
        children: [
          {
            title: this.$t('components.rule'),
            key: 'rules.ruleEngine',
            path: '/rules',
            parentKey: 'rules',
          },
          {
            title: this.$t('components.resources'),
            key: 'rules.resources',
            path: '/resources',
            parentKey: 'rules',
          },
          {
            title: this.$t('components.schemas'),
            key: 'rules.schema',
            path: '/schemas',
            parentKey: 'rules',
          },
        ],
      },
      {
        title: this.$t('components.modules'),
        key: 'modules',
        path: '/modules',
        icon: 'icon-changjingguanli',
      },
      {
        title: this.$t('components.plugins'),
        key: 'plugins',
        path: '/plugins',
        icon: 'icon-kongjian',
      },
      {
        title: this.$t('components.alerts'),
        key: 'alerts',
        path: '/alerts',
        icon: 'icon-gaojingkongxin',
      },
      {
        title: this.$t('components.tool'),
        key: 'tools',
        icon: 'icon-gongju',
        children: [
          {
            title: 'WebSocket',
            key: 'tool.WebSocket',
            path: '/websocket',
            parentKey: 'tools',
          },
        ],
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
        children: [
          {
            title: this.$t('components.application'),
            key: 'general.application',
            path: '/application',
            parentKey: 'general',
          },
          {
            title: this.$t('components.users'),
            key: 'general.user',
            path: '/users',
            parentKey: 'general',
          },
          {
            title: this.$t('components.blacklist'),
            key: 'general.blacklist',
            path: '/blacklist',
            parentKey: 'general',
          },
          {
            title: this.$t('components.backup'),
            key: 'general.backup',
            path: '/backup',
            parentKey: 'general',
          },
        ],
      },
      {
        title: this.$t('components.help'),
        key: 'cloudHelp',
        path: this.docs.cloudHelp,
        icon: 'icon-bangzhu',
      },
    ]
    this.initRouter()
  },

  methods: {
    handleClick(e) {
      if (e.key.endsWith('deployments/dashboard/introduction.html')) {
        window.open(e.key)
      } else {
        this.$router.push({ path: e.key })
      }
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
  min-height: calc(100vh - 80px);
  background-color: $color-theme;
  transition: all 0.3s;

  .menu-wrapper {
    margin-top: 80px;
  }
  .ant-menu {
    border-right-color: transparent;

    &.ant-menu-inline {
      border-right-color: #fff;
      border-right: 0;
    }
  }

  .ant-menu-sub,
  .ant-menu-dark {
    background-color: $color-theme;
  }

  .ant-menu-inline.ant-menu-sub {
    background: #00000075;
  }

  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon {
    margin-right: 12px;
    font-size: 18px;
  }

  .logo {
    text-align: center;
    width: 200px;
    font-size: 18px;
    height: 60px;
    line-height: 60px;
    color: #34c388;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background: #2f333e;

    .title {
      margin-left: 12px;
    }

    .logo-img {
      width: 48px;
      height: auto;
      position: relative;
      left: -3px;
    }

    .line {
      margin-top: 12px;
      width: 120px;
    }
  }

  .el-scrollbar {
    height: 100vh;
  }
}
.ant-menu-dark .ant-menu-sub {
  background-color: #000000ce;
}
</style>
