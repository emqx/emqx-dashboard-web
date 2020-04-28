<template>
  <div class="nav-header" :style="navHeadStyle">
    <div class="pull-left">
      <div class="func-item" @click="toggleLeftNarCollapse">
        <i
          :class="['iconfont', $store.state.leftBarCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
          style="font-size: 20px; line-height: 41px;"
        >
        </i>
      </div>
    </div>

    <breadcrumb></breadcrumb>

    <div class="pull-right">
      <!-- TODO: 补充使用情况 -->
      <el-tooltip effect="dark" :content="alertText" placement="bottom" :visible-arrow="false">
        <div class="alert-info func-item">
          <a-badge :count="alertCount">
            <router-link
              to="/alerts/list"
              tag="i"
              class="iconfont icon-Notificationlisttongzhiliebiao"
              @click="clearAlert"
            ></router-link>
          </a-badge>
        </div>
      </el-tooltip>

      <el-dropdown placement="bottom" class="user-info-dropdown" @command="handleLanguageDropdownCommand">
        <div class="user-info func-item">
          <span>
            <i class="iconfont icon-i18n"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="en" :class="{ active: language === 'en' }">English</el-dropdown-item>
            <el-dropdown-item command="zh" :class="{ active: language === 'zh' }">中文</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>

      <el-dropdown v-if="$hasShow('navbar.user')" placement="bottom" class="user-info-dropdown" @command="handleDropdownCommand">
        <div class="user-info func-item">
          <span>{{ username }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="application">{{ $t('components.applicationManagement') }}</el-dropdown-item>
            <el-dropdown-item command="users">{{ $t('components.usersManagement') }}</el-dropdown-item>
            <el-dropdown-item divided command="login">{{ $t('components.logOut') }}</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>
  </div>
</template>


<script>
import Breadcrumb from './Breadcrumb.vue'
import { loadAlarm } from '@/api/common'

export default {
  name: 'NavHeader',

  components: {
    Breadcrumb,
  },

  props: {},

  data() {
    return {}
  },

  computed: {
    alertCount() {
      return this.$store.state.alertCount
    },
    navHeadStyle() {
      return { left: !this.$store.state.leftBarCollapse ? '201px' : '80px' }
    },
    username() {
      return this.$store.state.user.username || this.$t('components.notLoggedIn')
    },
    alertText() {
      return this.alertCount > 0
        ? `${this.$t('components.theSystemHas')} ${this.alertCount} ${this.$t('components.noteAlertClickView')}`
        : this.$t('components.noWarning')
    },
    language() {
      return this.$store.state.lang
    },
  },

  created() {
    this.loadData()
    this.setHtmlLangAttr(this.language)
  },

  mounted() {
    window.onfocus = this.loadData()
  },

  methods: {
    setHtmlLangAttr(lang) {
      document.querySelector('html').setAttribute('lang', lang)
    },
    handleLanguageDropdownCommand(command) {
      if (this.language === command) {
        return
      }
      this.setHtmlLangAttr(command)
      this.$store.dispatch('SET_LANGUAGE', command)
    },
    clearAlert() {
      // this.alertCount = 0
    },
    async loadData() {
      const alert = await loadAlarm()
      this.$store.dispatch('SET_ALERT_COUNT', (alert || []).length)
    },
    logout() {
      this.$store.dispatch('UPDATE_USER_INFO', { logOut: true })
      setTimeout(() => {
        this.$message.success(this.$t('components.loggedOut'))
        this.$router.push('/login')
      }, 300)
    },
    toggleLeftNarCollapse() {
      const collapse = !this.$store.state.leftBarCollapse
      this.$store.dispatch('SET_LEFT_BAR_COLLAPSE', collapse)
    },
    handleDropdownCommand(command) {
      if (!command) {
        return
      }
      if (command !== 'login') {
        this.$router.push({ path: `/${command}` })
        return
      }
      this.$msgbox.confirm(this.$t('components.whetherToLogOutOrNot'), {
        confirmButtonText: this.$t('components.signOut'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(() => {
        this.logout()
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss" scoped>
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 20px 0 8px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  position: fixed;
  top: 0;
  right: 0;
  left: 201px;
  z-index: 100;
  transition: all .3s;
}

.pull-right {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.func-item {
  height: 50px;
  line-height: 53px;
  padding: 0 12px;
  transition: all .3s;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.024);
  }

  .iconfont {
    font-size: 18px;
    padding: 4px;
  }
}

.el-badge {
  line-height: 20px;
}

.el-dropdown-menu {
  width: 130px;
  text-align: center;
}
</style>
