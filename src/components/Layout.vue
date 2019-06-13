<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="200px">
      <left-bar></left-bar>
    </el-aside>

    <el-main style="margin: 0 16px">

      <div :style="{ padding: '24px', minHeight: '360px' }">
        <router-view></router-view>
      </div>
    </el-main>

  </el-container>
</template>

<script>
import LeftBar from '@/components/LeftBar'

export default {
  name: 'Layout',
  components: { LeftBar },
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
