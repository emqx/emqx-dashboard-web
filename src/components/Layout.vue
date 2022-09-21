<template>
  <el-container class="layout" style="min-height: 100vh">
    <!-- 左侧 -->
    <el-aside width="auto">
      <left-bar></left-bar>
    </el-aside>

    <el-main style="margin: 0; padding: 0" :style="elMainStyle">
      <el-header v-if="$hasShow('nav-header')" style="height: 50px; padding: 0">
        <nav-header></nav-header>
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
    <LicenseDialog v-model="licenseTipVisible" />
  </el-container>
</template>

<script>
import LeftBar from '@/components/LeftBar'
import NavHeader from '@/components/NavHeader'
import LicenseDialog from '@/views/Base/LicenseDialog.vue'

export default {
  name: 'Layout',

  components: {
    NavHeader,
    LeftBar,
    LicenseDialog,
  },

  data() {
    return {
      collapsed: false,
      theme: 'light',
      licenseTipVisible: false,
      alreadyPopupPwdMsg: false,
    }
  },

  computed: {
    license() {
      return this.$store.state.license
    },
    isEvaluationLicense() {
      return this.$store.getters.isEvaluationLicense
    },
    elAsideWidth() {
      return this.$store.state.leftBarCollapse ? 'auto' : '200px'
    },
    elMainStyle() {
      return { marginLeft: !this.$store.state.leftBarCollapse ? '200px' : '80px' }
    },
    isUsingDefaultPwd() {
      return this.$store.state.user.isUsingDefaultPwd
    },
  },

  watch: {
    isEvaluationLicense(nVal, oVal) {
      if (oVal && !nVal && this.isUsingDefaultPwd) {
        window.setTimeout(this.popupMessageBox, 300)
      }
    },
  },

  methods: {
    popupMessageBox() {
      // do not popup repeat
      if (this.alreadyPopupPwdMsg) {
        return
      }
      this.alreadyPopupPwdMsg = true
      this.$msgbox({
        type: 'info',
        message: this.$t('Base.defaultPwdTip'),
        confirmButtonText: 'OK',
        customClass: 'default-pwd-tip',
        callback: () => {
          const route = {
            name: 'users',
            params: { isForChangeDefaultPwd: true },
          }
          if (this.$route.name === 'users') {
            this.$router.replace({
              params: { isForChangeDefaultPwd: true },
              // just for vue route can update params, if don't add this, the params will not update
              // i think maybe this is a bug
              query: { _t: Date.now() },
            })
          } else {
            this.$router.push(route)
          }
        },
        showClose: false,
      })
    },
    async initLicense() {
      await this.$store.dispatch('GET_LICENSE')
      if (this.isEvaluationLicense && localStorage.getItem('licenseTipVisible') !== 'false') {
        this.licenseTipVisible = true
      } else if (this.license.expiry === true) {
        this.licenseTipVisible = true
      }
    },
  },

  async created() {
    if (this.isUsingDefaultPwd) {
      this.popupMessageBox()
    } else if (this.isEvaluationLicense) {
      this.initLicense()
    }
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
<style lang="scss">
.default-pwd-tip {
  .el-message-box__content {
    padding-top: 28px;
  }
}
</style>
