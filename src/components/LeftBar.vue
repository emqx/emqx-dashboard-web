<template>
  <div class="left-bar" :style="{ width: leftBarCollapse ? '80px' : '200px' }">
    <el-menu
      :default-active="defaultSelectedKeys"
      :collapse="leftBarCollapse"
      router
      :collapse-transition="false"
    >
      <template v-for="menu in menus">
        <template>
          <el-menu-item :key="menu.path" :index="menu.path">
            <i :class="['iconfont', menu.icon]"></i>
            <template #title>{{ menu.title }}</template>
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

  watch: {
    // $route() {
    //   this.initRouter()
    // },
    // leftBarCollapse(val) {
    //   if (val) {
    //     this.defaultOpenKeys = []
    //   } else {
    //     this.initRouter()
    //   }
    // },
  },

  created() {
    this.menus = [
      {
        title: this.$t('components.monitor'),
        path: '/monitor',
        icon: 'icon-yibiaopan',
      },
      // {
      //   title: this.$t('components.usersAcl'),
      //   path: '/users_and_acl',
      //   icon: 'icon-kongjian',
      // },
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
        icon: 'icon-guizeyinqing',
        path: '/ruleengine',
      },
      {
        title: this.$t('components.modules'),
        path: '/modules',
        icon: 'icon-changjingguanli',
      },
      {
        title: this.$t('components.alarm'),
        path: '/alarm',
        icon: 'icon-gaojing',
      },
      {
        title: this.$t('components.tools'),
        icon: 'icon-gongju',
        path: '/tools',
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
    // this.initRouter()
  },

  methods: {
    // handleClick(e) {
    //   this.$router.push({ path: e.key })
    // },
    // initRouter() {
    //   if (this.leftBarCollapse) {
    //     return
    //   }
    //   const { path } = this.$route
    //   this.menus.forEach((item) => {
    //     if (!item.key || !item.children) {
    //       return
    //     }
    //     if (item.children.find(($) => path.includes($.path) || path === $.path)) {
    //       if (!this.defaultOpenKeys.includes(item.key)) {
    //         this.defaultOpenKeys.push(item.key)
    //       }
    //     }
    //   })
    // },
  },
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
