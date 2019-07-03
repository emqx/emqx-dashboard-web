<template>
  <div class="left-bar">
    <div class="logo" :style="logoStyle">
      <img class="logo-img" src="../assets/emqx_logo.png" alt="logo">
      <div class="title">
        Dashboard
      </div>
    </div>

    <a-menu
      style="width: 200px"
      :default-selected-keys="defaultSelectedKeys"
      :default-open-keys="defaultOpenKeys"
      mode="inline"
      @click="handleClick"
    >
      <template v-for="item in menus">
        <a-sub-menu
          v-if="item.children && item.children.length > 0"
          :key="item.key"
          @titleClick="titleClick(item)"
        >
          <span slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </span>
          <template>
            <a-menu-item v-for="item2 in item.children" :key="item2.path">
              {{ item2.title }}
            </a-menu-item>
          </template>
        </a-sub-menu>

        <a-menu-item v-else-if="!item.children" :key="item.path">
          <i class="iconfont" :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </a-menu-item>
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
      menus: [
        {
          title: '监控',
          path: '/overview',
          icon: 'icon-yibiaopan',
        },
        {
          title: '连接',
          path: '/connections',
          icon: 'icon-zuzhiqunzu',
        },
        {
          title: '规则',
          key: 'rules',
          icon: 'icon-guizeyinqing',
          children: [
            {
              title: '规则引擎',
              path: '/rules',
              parentKey: 'rules',
            },
            {
              title: '资源',
              path: '/resources',
              parentKey: 'rules',
            },
          ],
        },
        {
          title: '告警',
          path: '/alerts',
          icon: 'icon-gaojingkongxin',
        },
        {
          title: '插件',
          path: '/plugins',
          icon: 'icon-kongjian',
        },
        {
          title: 'WebSocket',
          path: '/websocket',
          icon: 'icon-xinhao',
        },
        {
          title: '通用功能',
          path: 'function',
          icon: 'icon-fenzuguanli',
          children: [
            {
              title: '应用',
              path: '/application',
              parentKey: 'function',
            },
            {
              title: '用户',
              path: '/users',
              parentKey: 'function',
            },
            // {
            //   title: '系统设置',
            //   path: '/setting',
            //   parentKey: 'function',
            // },
          ],
        },
      ],
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

  created() {
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
        if (!item.key) {
          return
        }
        if (item.children.find($ => path.includes($.path) || path === $.path)) {
          this.defaultOpenKeys = [item.key]
        }
      })
    },
  },
}
</script>


<style lang="scss" scoped>
@import "../assets/style/element-variables";

.left-bar {
  min-height: calc(100vh - 80px);
  background-color: #fff;
}


.ant-menu {
  margin-top: 80px;
  border-right-color: transparent;

  &.ant-menu-inline {
    border-right-color: #fff;
    border-right: 0;
  }
}

.iconfont {
  margin-right: 8px;
}

.logo {
  text-align: center;
  width: 200px;
  font-size: 18px;
  /*font-weight: bolder;*/
  height: 60px;
  line-height: 60px;
  color: #34C388;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 100;
  transition: left .5s;
  box-shadow: 1px 1px 0 0 #e8e8e8;
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

  .unit {
    /*font-style: italic;*/
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

</style>
