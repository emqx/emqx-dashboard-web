<template>
  <div class="left-bar">
    <div class="logo">
      <div class="title" tag="div" to="/">EMQ X Dashboard</div>
      <div class="line"></div>
    </div>

    <div v-if="false" class="nav-item-wrapper">
      <router-link
        v-for="(item, i) in menus"
        :key="i"
        :to="item.path"
        class="nav-item"
        tag="div"
      >
        <i class="iconfont nav-icon" :class="item.icon"></i>

        <span class="title">{{ item.title }}</span>

        <div v-if="item.children && item.children.length > 0" class="nav-item-child-wrapper">
          <router-link
            v-for="(item, i) in item.children"
            :key="i"
            :to="{ path: item.path }"
            class="nav-item nav-item-child"
            tag="div"
          >
            <span class="title">{{ item.title }}</span>
          </router-link>
        </div>

      </router-link>
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

    <el-menu
      v-if="false"
      router
      :default-active="defaultSelectedKeys"
      :collapse="inlineCollapsed">
      <template v-for="item in menus">
        <el-submenu v-if="item.key" :index="item.path">
          <template slot="title">
            <i :class="['iconfont', item.icon]"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
          <el-menu-item v-for="item2 in item.children" :index="item2.path" :key="item2.path">
            <span slot="title">{{ item2.title }}</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item v-else :index="item.path">
          <i :class="['iconfont', item.icon]"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
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
    inlineCollapsed() {
      return this.$store.state.leftBarCollapse
    },
  },
}
</script>


<style lang="scss" scoped>
@import "../assets/style/element-variables";

.left-bar {
  min-height: 100%;
  background-color: #fff;

  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*bottom: 0;*/
}

.ant-menu {
  min-height: calc(100% - 80px);

  &.ant-menu-inline {
    border-right-color: #fff;
  }
}

.iconfont {
  margin-right: 8px;
}

.logo {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  padding: 20px 0;
  color: #34C388;
  overflow: hidden;

  .line {
    margin-top: 12px;
    width: 120px;
  }
}


.el-menu {
  min-height: calc(100% - 80px);

  &:not(.el-menu--collapse) {
    width: 200px;
  }
}

</style>
