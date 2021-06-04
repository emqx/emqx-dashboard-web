<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="auto" v-if="!layoutParams.hideLeft">
      <left-bar></left-bar>
    </el-aside>

    <el-main style="margin: 0; padding: 0" :style="elMainStyle">
      <el-header v-if="$hasShow('nav-header') && !layoutParams.hideHeader" style="height: 80px; padding: 0">
        <nav-header></nav-header>
        <nav-tabs></nav-tabs>
      </el-header>

      <div ref="body" :style="{ minHeight: '360px', minWidth: '600px', overflowX: 'hidden' }">
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

      layoutParmas: {
        hideLeft: false,
        hideHeader: false,
      },
    }
  },

  computed: {
    elAsideWidth() {
      return this.$store.state.leftBarCollapse ? 'auto' : '200px'
    },
    elMainStyle() {
      let px = 0
      if (!this.layoutParams.hideLeft) {
        px = !this.$store.state.leftBarCollapse ? 200 : 80
      }
      return { marginLeft: `${px}px` }
    },
  },
  created() {
    window.addEventListener('message', (event) => {
      if (typeof event.data === 'object' && 'lang' in event.data && event.data.lang !== this.$store.state.lang) {
        this.setLanguage(event.data.lang)
      }
    })
  },
  beforeMount() {
    this.getLayoutParams()
  },
  mounted() {
    if (this.$route.name === 'monitor') {
      this.refreshParentHeight(1600)
      setTimeout(() => this.refreshParentHeight(), 1024)
    } else {
      setTimeout(() => this.refreshParentHeight(), 0)
    }
  },
  updated() {
    setTimeout(() => {
      this.refreshParentHeight()
    }, 1000)
  },

  methods: {
    getLayoutParams() {
      const params = this.$route.query
      this.setAppMinWidth(params.hide_left)
      this.layoutParams = {
        hideLeft: params.hide_left,
        hideHeader: params.hide_header,
      }
    },
    setAppMinWidth(hideLeft) {
      if (hideLeft) {
        document.querySelector('#app').style.minWidth = '1000px'
      }
    },
    refreshParentHeight(minHeight = 700) {
      if (window.parent) {
        const height = this.$refs.body.offsetHeight
        window.parent.postMessage({ height: height > minHeight ? height : minHeight }, '*')
      }
    },
    setLanguage(lang) {
      this.$store.dispatch('SET_LANGUAGE', lang)
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
