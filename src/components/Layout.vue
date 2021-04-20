<template>
  <!-- 左侧 -->
  <div>
    <el-container>
      <el-aside :style="{ width: elAsideWidth }">
        <div class="logo" :style="{ paddingLeft: leftBarCollapse ? '6px' : '20px', width: elAsideWidth }">
          <img class="logo-img" src="../assets/emq_logo.svg" alt="logo" />
        </div>
        <left-bar></left-bar>
      </el-aside>
      <el-container class="layout" style="min-height: 100vh">
        <el-main style="margin: 0; padding: 0" :style="elMainStyle">
          <el-header v-if="$hasShow('nav-header')" style="height: 80px; padding: 0">
            <nav-header></nav-header>
            <!-- <nav-tabs></nav-tabs> -->
          </el-header>

          <div :style="{ minHeight: '360px', minWidth: '600px', overflowX: 'hidden' }">
            <!-- <transition name="fade-transform" mode="out-in"> -->
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <!-- </transition> -->
            <!-- <transition name="fade-transform" mode="out-in"> -->
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <!-- </transition> -->
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LeftBar from '@/components/LeftBar'
import NavHeader from '@/components/NavHeader'
// import NavTabs from '@/components/NavTabs.vue'

export default {
  name: 'Layout',

  components: {
    NavHeader,
    LeftBar,
    // NavTabs,
  },

  data() {
    return {
      collapsed: false,
      theme: 'light',
    }
  },

  computed: {
    leftBarCollapse() {
      return this.$store.state.leftBarCollapse
    },
    elAsideWidth() {
      return this.$store.state.leftBarCollapse ? '80px' : '200px'
    },
    elMainStyle() {
      return { marginLeft: !this.$store.state.leftBarCollapse ? '200px' : '80px' }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/style/variables.scss';
// @import '../assets/style/transition.scss';

.el-aside {
  background-color: $color-theme;
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  margin-top: 60px;
  height: calc(100vh - 60px);
  overflow-x: hidden;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
  }
}

.el-main {
  transition: margin-left 0.3s;
}

.logo {
  text-align: center;
  width: 200px;
  height: 60px;
  line-height: 60px;
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

  .logo-img {
    width: 72px;
    height: auto;
    position: relative;
    left: -3px;
  }

  .line {
    margin-top: 12px;
    width: 120px;
  }
}
</style>
