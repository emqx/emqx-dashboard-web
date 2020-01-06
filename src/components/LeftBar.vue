<template>
  <div class="left-bar">
    <div class="logo" :style="logoStyle">
      <img class="logo-img" src="../assets/emqx_logo.png" alt="logo">
      <div class="title">
        Dashboard
      </div>
    </div>

    <a-menu
      class="menu-wrapper"
      :default-selected-keys="defaultSelectedKeys"
      :selected-keys="defaultSelectedKeys"
      :open-keys.sync="defaultOpenKeys"
      mode="inline"
      theme="dark"
      @click="handleClick"
    >
      <template v-for="item in menus">
        <template v-if="$hasShow(item.key)">
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.key" @titleClick="titleClick(item)">
            <span slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </span>
            <template v-for="item2 in item.children">
              <a-menu-item v-if="$hasShow(item2.key)" :key="item2.path">
                {{ item2.title }}
              </a-menu-item>
            </template>
          </a-sub-menu>

          <a-menu-item v-else-if="!item.children && $hasShow(item.key)" :key="item.path">
            <i class="iconfont" :class="item.icon"></i>
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
    }
  },

  computed: {
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
  },

  created() {
    this.menus = [
      {
        title: this.$t('components.monitor'),
        path: '/monitor',
        icon: 'icon-yibiaopan',
      },
      {
        title: this.$t('components.connect'),
        path: '/connections',
        icon: 'icon-zuzhiqunzu',
      },
      {
        title: this.$t('components.rule'),
        key: 'rules',
        icon: 'icon-guizeyinqing',
        children: [
          {
            title: this.$t('components.ruleEngine'),
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
            title: this.$t('components.schema'),
            key: 'rules.schema',
            path: '/schemas',
            parentKey: 'rules',
          },
        ],
      },
      {
        title: this.$t('components.alarm'),
        key: 'alerts',
        path: '/alerts',
        icon: 'icon-gaojingkongxin',
      },
      {
        title: this.$t('components.plugin'),
        key: 'plugins',
        path: '/plugins',
        icon: 'icon-kongjian',
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
            title: this.$t('components.user'),
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
        ],
      },
    ]
    this.initRouter()
  },

  methods: {
    handleClick(e) {
      this.$router.push({ path: e.key })
    },
    titleClick() {
    },
    initRouter() {
      const { path } = this.$route
      this.menus.forEach((item) => {
        if (!item.key || !item.children) {
          return
        }
        if (item.children.find($ => path.includes($.path) || path === $.path)) {
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

  .menu-wrapper {
    width: 200px;
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

  .iconfont {
    margin-right: 8px;
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
    transition: left 0.5s;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .title {
      margin-left: 12px;
    }

    .logo-img {
      width: 48px;
      height: auto;
    }

    .line {
      margin-top: 12px;
      width: 120px;
    }
  }

  .el-scrollbar {
    height: 100vh;
  }

  .el-menu {
    min-height: calc(100% - 80px);

    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
