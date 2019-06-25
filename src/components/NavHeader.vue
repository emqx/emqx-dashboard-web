<template>
  <div class="nav-header">
    <div class="pull-left">
      <div class="func-item" @click="toggleLeftNarCollapse">
        <i :class="['iconfont', $store.state.leftBarCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
      </div>
    </div>


    <div class="pull-right">
      <el-tooltip effect="dark" content="使用文档" placement="bottom" :visible-arrow="false">
        <div class="document-link func-item">
          <i class="iconfont icon-icon_yiwenkongxin"></i>
        </div>
      </el-tooltip>


      <div class="alert-info func-item">
        <el-badge is-dot>
          <i class="iconfont icon-Notificationlisttongzhiliebiao"></i>
        </el-badge>
      </div>


      <el-dropdown placement="bottom" class="user-info-dropdown" @command="handleDropdownCommand">
        <div class="user-info func-item">
          <span>{{ username }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">系统设置</el-dropdown-item>
            <el-dropdown-item command="app">应用管理</el-dropdown-item>
            <el-dropdown-item divided command="login">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>


      <!--<div class="i18n-link func-item"></div>-->
    </div>
  </div>
</template>


<script>
export default {
  name: 'NavHeader',

  components: {},

  props: {},

  data() {
    return {}
  },

  computed: {
    username() {
      return this.$store.state.user.username || '未登录'
    },
  },

  created() {},

  methods: {
    toggleLeftNarCollapse() {
      const collapse = !this.$store.state.leftBarCollapse
      this.$store.dispatch('SET_LEFT_BAR_COLLAPSE', collapse)
    },
    handleDropdownCommand(command) {
      if (!command) {
        return
      }
      this.$router.push({ path: `/${command}` })
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
  border-left: 1px solid #f0f2f5;
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
