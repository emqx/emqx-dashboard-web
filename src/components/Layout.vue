<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="200px">
      <left-bar></left-bar>
    </el-aside>


    <el-main style="margin: 0;padding: 0;">

      <el-header style="height: 64px;padding: 0">
        <nav-header></nav-header>
      </el-header>

      <div :style="{ padding: '24px', minHeight: '360px' }">
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
}
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #fff;
}
</style>
