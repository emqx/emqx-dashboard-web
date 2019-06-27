<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="200px" :style="elAsideStyle">
      <left-bar></left-bar>
    </el-aside>


    <el-main style="margin: 0;padding: 0;" :style="elMainStyle">

      <el-header style="height: 64px;padding: 0">
        <nav-header></nav-header>
      </el-header>

      <div :style="{ padding: '24px', minHeight: '360px', minWidth: '600px' }">
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import LeftBar from '@/components/LeftBar'
import NavHeader from '@/components/NavHeader'

export default {
  name: 'Layout',
  components: { NavHeader, LeftBar },
  data() {
    return {
      collapsed: false,
      theme: 'light',
    }
  },
  computed: {
    elAsideStyle() {
      return { left: !this.$store.state.leftBarCollapse ? 0 : '-200px' }
    },
    elMainStyle() {
      return { marginLeft: !this.$store.state.leftBarCollapse ? '200px' : 0 }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #fff;
  transition: left .5s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.el-main {
  transition: margin-left .5s;
}
</style>
