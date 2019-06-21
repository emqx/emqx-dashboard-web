<template>
  <div class="left-bar">
    <div class="logo">
      <div class="title" tag="div" to="/">EMQ X Dashboard</div>
      <div class="line"></div>
    </div>

    <div class="nav-item-wrapper">
      <router-link
        v-for="(item, i) in menus"
        :key="i"
        :to="item.path"
        class="nav-item"
        tag="div"
      >
        <i class="iconfont nav-icon" :class="item.icon"></i>

        {{ item.title }}

        <div v-if="item.children && item.children.length > 0" class="nav-item-child-wrapper">
          <router-link
            v-for="(item, i) in item.children"
            :key="i"
            :to="{ path: item.path }"
            class="nav-item nav-item-child"
            tag="div">
            {{ item.title }}
          </router-link>
        </div>

      </router-link>
    </div>

    <div class="footer-wrapper" v-if="false">
      <!--<div class="alert">-->
      <!--<a-icon type="notification"/>-->
      <!--</div>-->
      <i class="logout iconfont icon-logout"></i>
      <div class="user-info">admin</div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'LeftBar',

  components: {},

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
          title: '规则引擎',
          path: '/rules',
          icon: 'icon-guizeyinqing',
          children: [
            {
              title: '规则',
              path: '/rules/list',
            },
            {
              title: '资源',
              path: '/rules/resources',
            },
          ],
        },
        {
          title: '告警',
          path: '/alert',
          icon: 'icon-gaojingkongxin',
        },
        {
          title: '插件',
          path: '/plugins',
          icon: 'icon-kongjian',
        },
        {
          title: '工具',
          path: '/websocket',
          icon: 'icon-yunduanshuaxin',
          children: [
            {
              title: 'WebSocket',
              path: '/websocket',
            },
            {
              title: 'Tracker',
              path: '/tracker',
            },
          ],
        },
        {
          title: '通用功能',
          path: '/function',
          icon: 'icon-fenzuguanli',
          children: [
            {
              title: '错误日志',
              path: '/func/error',
            },
            {
              title: '系统设置',
              path: '/func/setting',
            },
          ],
        },
      ],
    }
  },

  created() {
    this.initRouter()
  },

  methods: {
    initRouter() {
    },
  },
}
</script>


<style lang="scss" scoped>
@import "../assets/style/element-variables";

.left-bar {
  position: relative;
  min-height: 100%;
}

.logo {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  padding: 20px 0;
  color: #34C388;
}

.line {
  margin-top: 12px;
  width: 120px;
}

.nav-item-wrapper {
  margin-top: 12px;

  .nav-item-child-wrapper {
    padding-left: 50px;
    display: none;
    transition: all .3s;
  }

  .nav-item {
    width: 100%;
    min-height: 40px;
    line-height: 40px;
    padding-left: 12px;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: all .3s;
    position: relative;


    &:hover {
      color: rgba(0, 0, 0, 0.9);
    }

    &:before {
      top: .25rem;
      bottom: .25rem;
      left: 0;
      right: auto;
      border-left: 4px solid $--color-primary;
      border-bottom: 0;
      content: ' ';
      position: absolute;
      display: none;
    }


    &.router-link-active {
      color: rgba(0, 0, 0, 0.8);
      font-weight: bold;

      .iconfont {
        font-weight: normal;
      }

      .nav-item-child:not(.router-link-active) {
        font-weight: normal;
      }

      &:not(.nav-item-child):before {
        display: block;
      }

      .nav-item-child-wrapper {
        display: block;
      }
    }

    .nav-icon {
      margin: 10px;
    }

  }
}


.footer-wrapper {
  border-top: 1px solid #d9d9d9;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 22px;
  height: 48px;
  color: #34C388;
  position: absolute;
  bottom: 0;
  left: 0;

  .user-info {
    cursor: pointer;
    padding-left: 12px;
  }
}

.logout {
  cursor: pointer;
  margin-top: 3px;
}
</style>
