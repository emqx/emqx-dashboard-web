<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside :width="leftBarWidth">
      <left-bar></left-bar>
    </el-aside>


    <el-main style="margin: 0;padding: 0;">

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
    leftBarWidth() {
      return this.$store.state.leftBarCollapse ? '0px' : '200px'
    },
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #fff;
  transition: width .3s;
}
</style>
