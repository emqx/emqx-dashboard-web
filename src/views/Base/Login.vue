<template>
  <div class="login">
    <a-card class="login-card emq-list-card">

      <div class="split-wrapper">
        <div class="logo-wrapper">
          <!--<div class="logo">-->
          <!--<img src="../../assets/emqlogo.png" alt="">-->
          <!--</div>-->
        </div>

        <div :span="12" class="login-wrapper">
          <div class="emq-title">
            {{ $t('Base.signIn') }}
            <div class="sub-title">
              {{ $t('Base.loginUserAccount') }}
              <a :href="$t('Base.userCreate')" target="_blank">
                {{ $t('Base.forgetPassword') }}
              </a>
            </div>
          </div>
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

            <el-form-item prop="username">
              <el-input v-model="record.username" :placeholder="$t('Base.userName')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="record.password" type="password" :placeholder="$t('Base.password')"></el-input>
            </el-form-item>

            <el-checkbox v-model="record.remember">{{ $t('Base.remember') }}</el-checkbox>

            <el-form-item class="oper-wrapper" label="">
              <el-button class="sub-btn" type="primary" @click="login">{{ $t('Base.signIn') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
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
      auth({
        username,
        password,
      }).then((res) => {
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
      }).catch((error) => {
        this.loginError = error
      })
    },
  },
}
</script>


<style lang="scss">
.login {
  width: 100vw;
  min-height: 100vh;
  /*background-color: #181818;*/
  box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);

  .ant-card-body {
    padding: 0;
  }

  .emq-title {
    margin-bottom: 32px;
  }

  .el-form-item {
    margin: 42px 0;
  }

  .logo-wrapper {
    background-image: url("../../assets/emqx_banner.png");
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    height: 512px;
    border-radius: 6px 0 0 6px;

    .logo {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      text-align: center;

      img {
        width: 84px;
      }
    }

    width: 50%;
    float: left;
  }

  .login-wrapper {
    width: 50%;
    float: left;
    padding: 24px;
    height: 512px;
  }

  .login-card {
    width: 640px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
  }

  .oper-wrapper {
    margin-top: 32px;
  }

  .login-footer {
  }

  .sub-btn {
    width: 100%;
  }
}

</style>
