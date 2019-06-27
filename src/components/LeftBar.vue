<template>
  <el-scrollbar class="left-bar">
    <div class="logo" :style="logoStyle">
      <div class="title" tag="div" to="/">EMQ X Dashboard</div>
      <div class="line"></div>
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
          @titleClick="titleClick(item)">
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
  </el-scrollbar>
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
          title: '工具',
          key: 'tools',
          icon: 'icon-yunduanshuaxin',
          children: [
            {
              title: 'WebSocket',
              path: '/websocket',
              parentKey: 'tools',
            },
            {
              title: 'Tracker',
              path: '/tracker',
              parentKey: 'tools',
            },
          ],
        },
        {
          title: '通用功能',
          path: 'function',
          icon: 'icon-fenzuguanli',
          children: [
            {
              title: '错误日志',
              path: '/error_log',
              parentKey: 'function',
            },
            {
              title: '系统设置',
              path: '/setting',
              parentKey: 'function',
            },
          ],
        },
      ],
      defaultOpenKeys: [],
    }
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
        if (item.children.find($ => $.path === path)) {
          this.defaultOpenKeys = [item.key]
        }
      })

    },
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

  &.ant-menu-inline {
    border-right-color: #fff;
  }
}

.iconfont {
  margin-right: 8px;
}

.logo {
  text-align: center;
  width: 200px;
  font-size: 18px;
  font-weight: 500;
  padding: 20px 0;
  color: #34C388;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 100;
  transition: left .5s;

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
