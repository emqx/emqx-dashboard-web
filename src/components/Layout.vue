<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="200px" :style="elAsideStyle">
      <left-bar></left-bar>
    </el-aside>

    <el-main style="margin: 0;padding: 0;" :style="elMainStyle">

      <el-header style="height: 80px;padding: 0">
        <nav-header></nav-header>
        <nav-tabs></nav-tabs>
      </el-header>

      <div :style="{ minHeight: '360px', minWidth: '600px', overflowX: 'hidden' }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
        </transition>
        <transition name="fade-transform" mode="out-in">
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </transition>
      </div>
    </el-main>
  </el-container>
</template>


<script>
import LeftBar from '@/components/LeftBar'
import NavHeader from '@/components/NavHeader'
import NavTabs from '@/components/NavTabs.vue'

export default {
  name: 'Layout',

  components: {
    NavHeader,
    LeftBar,
    NavTabs,
  },

  data() {
    return {
      collapsed: false,
      theme: 'light',
    }
  },

  computed: {
    elAsideStyle() {
      return {
        left: !this.$store.state.leftBarCollapse ? 0 : '-200px',
        boxShadow: this.$store.state.leftBarCollapse ? 'none' : '2px 0 8px 0 rgba(29,35,41,.05)',
      }
    },
    elMainStyle() {
      return { marginLeft: !this.$store.state.leftBarCollapse ? '200px' : 0 }
    },
  },
}
</script>


<style lang="scss" scoped>
@import "../assets/style/variables.scss";
@import "../assets/style/transition.scss";

.el-aside {
  background-color: $color-theme;
  transition: left .5s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.el-main {
  transition: margin-left .5s;
}
</style>
