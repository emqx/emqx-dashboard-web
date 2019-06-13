<template>
  <div class="login">
    <a-card title="登录" class="login-card">
      <el-form
        ref="record"
        :model="record"
        :rules="rules"
        hide-required-asterisk
        :show-message="false"
        @keyup.enter.native="login"
      >
        <el-alert
          v-if="loginError"
          :title="loginError"
          type="error"
          @close="loginError = ''"
        >
        </el-alert>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="record.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="record.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="record.remember">记住</el-checkbox>
          <el-button type="primary" style="float: right" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </a-card>
  </div>
</template>


<script>
// eslint-disable-next-line
import { auth } from '@/api/common'
// eslint-disable-next-line
import { awaitWrap } from '@/common/utils'

export default {
  name: 'Login',

  components: {},

  props: {},

  data() {
    return {
      record: {
        username: '',
        password: '',
        remember: false,
      },
      loginError: '',
      rules: {
        username: { required: true },
        password: { required: true },
      },
    }
  },

  created() {
    this.$store.dispatch('UPDATE_USER_INFO', { logOut: true })
  },

  methods: {
    async login() {
      if (!await awaitWrap(this.$refs.record.validate())) {
        return
      }
      const { username, password, remember } = this.record
      const res = await auth({
        username,
        password,
      }).catch((error) => {
        this.loginError = error
      })
      if (!res) {
        return
      }
      this.loginError = ''
      this.$store.dispatch('UPDATE_USER_INFO', { username, password, remember })
      setTimeout(() => {
        const { to = '/' } = this.$route.query
        this.$router.replace({
          path: to,
        })
      }, 500)
    },
  },
}
</script>


<style lang="scss" scoped>
.login {
  width: 100vw;
  min-height: 100vh;
  background-color: #181818;
}

.login-card {
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-footer {
}
</style>
