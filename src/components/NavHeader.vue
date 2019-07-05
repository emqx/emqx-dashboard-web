<template>
  <div class="nav-header" :style="navHeadStyle">
    <div class="pull-left">
      <div class="func-item" @click="toggleLeftNarCollapse">
        <i :class="['iconfont', $store.state.leftBarCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
      </div>
    </div>

    <!--<div class="search-wrapper">-->
    <!---->
    <!--</div>-->


    <div class="pull-right">
      <el-tooltip effect="dark" content="使用文档" placement="bottom" :visible-arrow="false">
        <div class="document-link func-item">
          <i class="iconfont icon-icon_yiwenkongxin"></i>
        </div>
      </el-tooltip>


      <el-tooltip effect="dark" :content="alertText" placement="bottom" :visible-arrow="false">
        <div class="alert-info func-item">
          <a-badge :count="alertCount">
            <router-link to="/alerts/list" tag="i" class="iconfont icon-Notificationlisttongzhiliebiao"
                         @click="clearAlert"></router-link>
          </a-badge>
        </div>
      </el-tooltip>


      <el-dropdown placement="bottom" class="user-info-dropdown" @command="handleDropdownCommand">
        <div class="user-info func-item">
          <span>{{ username }}</span>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item command="setting">系统设置</el-dropdown-item>-->
            <el-dropdown-item command="application">应用管理</el-dropdown-item>
            <el-dropdown-item command="users">用户管理</el-dropdown-item>
            <el-dropdown-item divided command="login">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>


      <!--<div class="i18n-link func-item"></div>-->
    </div>
  </div>
</template>


<script>
import { loadAlarm } from '@/api/common'

export default {
  name: 'NavHeader',

  components: {},

  props: {},

  data() {
    return {
      alertCount: 100,
    }
  },

  computed: {
    navHeadStyle() {
      return { left: !this.$store.state.leftBarCollapse ? '201px' : 0 }
    },
    username() {
      return this.$store.state.user.username || '未登录'
    },
    alertText() {
      return this.alertCount > 0 ? `系统有 ${this.alertCount} 条告警，点击查看` : '暂无告警'
    },
  },

  created() {
    this.loadData()
  },

  mounted() {
    window.onfocus = this.loadData()
  },

  methods: {
    clearAlert() {
      // this.alertCount = 0
    },
    async loadData() {
      const alert = await loadAlarm()
      this.alertCount = Array.isArray(alert) ? alert.length : 0
    },
    logout() {
      this.$store.dispatch('UPDATE_USER_INFO', { logOut: true })
      setTimeout(() => {
        this.$message.success('已退出登录')
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
      this.$msgbox.confirm('是否退出登录?', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
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
  height: 60px;
  padding: 0 20px 0 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  position: fixed;
  top: 0;
  right: 0;
  left: 201px;
  z-index: 100;
  transition: left .5s;
}

.pull-right {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.func-item {
  height: 60px;
  line-height: 60px;
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
