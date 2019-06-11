<template>
  <a-layout class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <a-layout-sider v-model="collapsed" :theme="theme">
      <left-bar></left-bar>
    </a-layout-sider>

    <a-layout>

      <a-layout-content style="margin: 0 16px">
        <div :style="{ padding: '24px', minHeight: '360px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>


      <a-layout-footer style="text-align: center">
        EMQ X Dashboard
      </a-layout-footer>
    </a-layout>

  </a-layout>
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

<style lang="less" scoped>
.a-layout-sider {

}
</style>
