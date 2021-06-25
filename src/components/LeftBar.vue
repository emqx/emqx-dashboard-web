<template>
  <div class="left-bar" :style="{ width: leftBarCollapse ? '80px' : '200px' }">
    <el-menu
      :default-active="defaultSelectedKeys"
      :collapse="leftBarCollapse"
      router
      :collapse-transition="false"
    >
      <template v-for="(menu, i) in menus">
        <template v-if="menu.c">
          <el-submenu :key="menu.title" :index="'' + i">
            <template #title>
              <i :class="['iconx', menu.icon]"></i>
              <span>{{ menu.title }}</span>
            </template>
            <template v-for="item in menu.c">
              <el-menu-item :key="item.title" :index="item.path">
                <template>{{ item.title }}</template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="menu.title" :index="menu.path">
            <i :class="['iconx', menu.icon]"></i>
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
  },

  watch: {},

  created() {
    let dashboard = [
      {
        title: this.$t('components.dashboard'),
        path: '/dashboard',
      },
      {
        title: this.$t('components.alarm'),
        path: '/alarm',
      },
      {
        title: this.$t('components.tools'),
        path: '/tools',
      },
    ]

    let management = [
      {
        title: this.$t('components.clients'),
        path: '/clients',
      },
      {
        title: this.$t('components.topics'),
        path: '/topics',
      },
      {
        title: this.$t('components.subscriptions'),
        path: '/subscriptions',
      },
    ]

    this.menus = [
      {
        title: this.$t('components.monitoring'),
        icon: 'icon-yibiaopan',
        c: dashboard,
      },
      {
        title: this.$t('components.management'),
        icon: 'icon-yibiaopan',
        c: management,
      },
      {
        title: this.$t('components.ruleengine'),
        icon: 'icon-guizeyinqing',
        path: '/ruleengine',
      },
      {
        title: this.$t('components.modules'),
        path: '/modules',
        icon: 'icon-changjingguanli',
      },
      {
        title: this.$t('components.setting'),
        path: '/setting',
        icon: 'icon-icon_shezhi',
      },
      {
        title: this.$t('components.general'),
        icon: 'icon-fenzuguanli',
        path: '/general',
      },
    ]
  },

  methods: {},
}
</script>

<style lang="scss">
.left-bar {
  margin-top: 60px;
  height: calc(100vh - 60px);
  transition: all 0.3s;

  .el-menu--collapse {
    width: 80px;

    & i {
      margin-left: 10px;
    }
  }
}
</style>
