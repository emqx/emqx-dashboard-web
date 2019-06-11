<template>
  <div class="left-bar">
    <div class="logo">
      <router-link class="title" tag="div" to="/">EMQ X Dashboard</router-link>
      <div class="line"></div>
    </div>

    <div class="router-item-wrapper">
      <router-link
        v-for="(item, i) in menus"
        class="router-item"
        tag="div"
        :key="i"
        :to="item.path">
        {{ item.title }}
      </router-link>
    </div>

    <div class="footer-wrapper">
      <!--<div class="alert">-->
        <!--<a-icon type="notification"/>-->
      <!--</div>-->
      <div class="logout">
        <a-icon type="logout"/>
      </div>
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
          title: '服务器状态',
          path: '/',
        },
        {
          title: '连接',
          path: '/connections',
        },
        {
          title: '资源中心',
          path: '/resources',
        },
      ],
    }
  },

  methods: {},

  created() {},
}
</script>


<style lang="less" scoped>
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

.router-item-wrapper {
  margin-top: 12px;

  .router-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 22px;
    color: #808080;
    cursor: pointer;
    border-left: 3px solid #fff;
    transition: all .3s;

    &:hover {
      color: #606060;
      background-color: #f1f1f1;
      border-left-color: #f1f1f1;
    }

    &.router-link-active {
      border-left-color: #34C388;
      color: #606060;
      background-color: #f1f1f1;
    }
  }
}

.footer-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 22px;
  height: 48px;
  color: #808080;
  position: absolute;
  bottom: 0;
  left: 0;

  &:hover {
    color: #606060;
  }

  .user-info {
    cursor: pointer;
    padding-left: 12px;
  }
}
.logout {
  cursor: pointer;
}
</style>
