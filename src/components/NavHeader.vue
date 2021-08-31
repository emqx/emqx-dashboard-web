<template>
  <div class="nav-header" :style="{ left: leftBarCollapse ? '201px' : '80px' }">
    <div>
      <div
        class="func-item"
        @click="
          () => {
            $store.dispatch('SET_LEFT_BAR_COLLAPSE', !this.leftBarCollapse)
          }
        "
      >
        <i :class="['iconfont', leftBarCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"> </i>
      </div>
    </div>

    <!-- <breadcrumb></breadcrumb> -->
    <div class="header-title">{{ $t(`components.${firstPath}`) }}</div>

    <div class="pull-right">
      <el-tooltip effect="dark" :content="alertText" placement="bottom" :visible-arrow="false">
        <div class="alert-info func-item">
          <el-badge :is-dot="!!alertCount">
            <router-link to="/alarm" class="iconx icon-alarm"></router-link>
          </el-badge>
        </div>
      </el-tooltip>

      <el-dropdown placement="bottom" @command="handleLanguageDropdownCommand">
        <div class="user-info func-item">
          <i class="iconx icon-globe"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="en" :class="{ active: language === 'en' }"
              >English</el-dropdown-item
            >
            <el-dropdown-item command="zh" :class="{ active: language === 'zh' }"
              >中文</el-dropdown-item
            >
          </el-dropdown-menu>
        </div>
      </el-dropdown>

      <el-dropdown placement="bottom" @command="handleDropdownCommand">
        <div class="user-info func-item">
          <span>{{ username }}</span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="general/application">{{
              $t('components.applicationManagement')
            }}</el-dropdown-item> -->
            <el-dropdown-item command="users">{{
              $t('components.usersManagement')
            }}</el-dropdown-item>
            <el-dropdown-item divided command="logout">{{
              $t('components.logOut')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>

      <el-button class="go-link" @click="gotoCloud">Try Cloud ➝</el-button>
    </div>
  </div>
</template>

<script>
import { loadAlarm } from '@/api/common'
import { toLogin } from '@/common/utils'
export default {
  name: 'NavHeader',
  data() {
    return {
      firstPath: '',
    }
  },
  computed: {
    alertCount() {
      return this.$store.state.alertCount
    },
    leftBarCollapse() {
      return this.$store.state.leftBarCollapse
    },

    username() {
      return this.$store.state.user.username
    },
    alertText() {
      return this.alertCount > 0
        ? `${this.$t('components.theSystemHas')} ${this.alertCount} ${this.$t(
            'components.noteAlertClickView',
          )}`
        : this.$t('components.noWarning')
    },
    language() {
      return this.$store.state.lang
    },
  },
  watch: {
    $route() {
      this.setHeaderTitle()
    },
  },

  created() {
    this.loadData()
    this.setHtmlLangAttr(this.language)
    this.setHeaderTitle()
  },

  mounted() {
    document.addEventListener('visibilitychange', this.visibilityChangeFunc)
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.visibilityChangeFunc)
  },

  methods: {
    visibilityChangeFunc() {
      return document.visibilityState === 'visible' && this.loadData()
    },
    setHtmlLangAttr(lang) {
      document.querySelector('html').setAttribute('lang', lang)
    },
    handleLanguageDropdownCommand(command) {
      if (this.language === command) {
        return
      }
      this.setHtmlLangAttr(command)
      this.$store.dispatch('SET_LANGUAGE', command)
      location.reload()
    },
    async loadData() {
      const alert = await loadAlarm().catch(() => {})
      this.$store.dispatch('SET_ALERT_COUNT', (alert || []).length)
    },
    logout() {
      this.$msgbox
        .confirm(this.$t('components.whetherToLogOutOrNot'), {
          confirmButtonText: this.$t('components.signOut'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(() => {
          this.$message.success(this.$t('components.loggedOut'))
          toLogin()
        })
        .catch((e) => {})
    },
    handleDropdownCommand(command) {
      if (!command) {
        return
      }
      ;(this[command] && this[command]()) ||
        (this.$router.currentRoute?.name !== command && this.$router.push({ name: command }))
    },
    gotoCloud() {
      window.open('https://www.emqx.com/cloud', '_blank')
    },
    setHeaderTitle() {
      let { path } = this.$route || []
      let firstPath = path.split('/')[1]
      this.firstPath = firstPath
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/element-variables';
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px 0 8px;
  background-color: #fff;

  left: 201px;
  z-index: 100;
  transition: all 0.3s;
}

.header-title {
  font-size: 32px;
  font-weight: 900;
  padding-left: 20px;
}

.pull-right {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
}

.func-item {
  padding: 0 10px;
  transition: all 0.3s;
  cursor: pointer;

  .iconfont {
    font-size: 20px;
    color: $--color-black;

    &:hover {
      color: $--color-hover;
    }
  }

  span:hover {
    color: $--color-hover;
  }
}

.el-badge {
  &::v-deep .is-fixed.is-dot {
    right: 5px;
    top: 3px;
  }
}

.el-button.go-link {
  background-color: #282e38ff;
  color: #fff;
  padding: 0 15px;
  font-size: 14px;
  height: 32px;
  border: 1px solid #282e38ff;
  margin-left: 15px;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #282e38ff;
  }
}
</style>
