<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="auto">
      <left-bar></left-bar>
    </el-aside>

    <el-main style="margin: 0; padding: 0" :style="elMainStyle">
      <el-header v-if="$hasShow('nav-header')" style="height: 80px; padding: 0">
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
import checkIsDefaultPwd from '@/common/for_huawei'

export default {
  name: 'Layout',

  components: {
    NavHeader,
    LeftBar,
    NavTabs,
  },

  created() {
    checkIsDefaultPwd()
  },

  data() {
    return {
      collapsed: false,
      theme: 'light',
    }
  },

  computed: {
    elAsideWidth() {
      return this.$store.state.leftBarCollapse ? 'auto' : '200px'
    },
    elMainStyle() {
      return { marginLeft: !this.$store.state.leftBarCollapse ? '200px' : '80px' }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/style/variables.scss';
@import '../assets/style/transition.scss';

.el-aside {
  background-color: $color-theme;
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.el-main {
  transition: margin-left 0.3s;
}
</style>
