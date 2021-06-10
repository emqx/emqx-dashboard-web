<template>
  <div
    :class="[
      'login',
      loginKeepHeight && 'login-align-height',
      loginKeepWidth && 'login-align-width',
    ]"
  >
    <el-card shadow="never" v-if="isNeedAuth" class="login-card emq-list-card" id="login">
      <div class="split-wrapper">
        <div class="logo-wrapper"></div>

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
            @keyup.enter.native="nativeLogin"
          >
            <el-form-item prop="username">
              <el-input v-model="record.username" :placeholder="$t('Base.userName')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="record.password"
                type="password"
                :placeholder="$t('Base.password')"
              ></el-input>
            </el-form-item>

            <el-checkbox v-model="record.remember">{{ $t('Base.remember') }}</el-checkbox>

            <el-form-item class="oper-wrapper" label="">
              <el-button class="sub-btn" type="primary" @click="nativeLogin" :loading="logining">{{
                $t('Base.signIn')
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { auth } from '@/api/common'
import { awaitWrap } from '@/common/utils'
import store from '@/stores'
// import { ElMessage } from 'element-ui'

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
      logining: false,
      rules: {
        username: [
          {
            required: true,
            message: this.$t('Base.unameRequired'),
            trigger: blur,
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('Base.passwordRequired'),
            trigger: blur,
          },
        ],
      },
      isNeedAuth: true,
      fullLoading: false,
      fromCloud: false,
      loginKeepHeight: false,
      loginKeepWidth: false,
    }
  },

  computed: {
    lang() {
      return this.$store.state.lang
    },
  },

  created() {
    if (store.state.config.baseURL === '/dashboard') {
      this.fromCloud = true
    }
    const { lang } = this.$route.query
    if (['en', 'zh'].indexOf(lang) !== -1 && this.language !== lang && this.fromCloud) {
      document.querySelector('html').setAttribute('lang', lang)
      localStorage.setItem('language', lang)
      this.$i18n.locale = lang
    }
    this.$store.dispatch('UPDATE_USER_INFO', { logOut: true })
    this.autoLogin()
  },
  mounted() {
    this.adjustLayout()
    window.addEventListener('resize', this.adjustLayout)
  },
  destroyed() {
    window.removeEventListener('resize', this.adjustLayout)
  },

  methods: {
    adjustLayout() {
      const wWidth = window.innerWidth
      const wHeight = window.innerHeight
      const loginDom = document.querySelector('#login')
      const lWidth = loginDom.clientWidth
      const lHeight = loginDom.clientHeight
      const loginParentDomStyle = window.getComputedStyle(loginDom.parentElement)
      const lpPadding = loginParentDomStyle.paddingTop

      wHeight > lHeight + 2 * parseInt(lpPadding)
        ? (this.loginKeepHeight = true)
        : (this.loginKeepHeight = false)
      // wWidth >lWidth?(this.loginKeepWidth=true):(this.loginKeepWidth=false)
    },
    login() {
      const { username, password, remember } = this.record
      this.logining = true

      auth({
        username,
        password,
      })
        .then((res) => {
          if (!res) {
            return
          }
          this.$store.dispatch('UPDATE_USER_INFO', {
            username,
            password,
            remember,
          })
          setTimeout(() => {
            const { to = this.fromCloud ? '/users_and_acl' : '/' } = this.$route.query
            this.$router.replace({
              path: to,
            })
            if (!this.isNeedAuth) {
              this.fullLoading.close()
            }
          }, 500)
        })
        .catch((error) => {
          if (!this.isNeedAuth) {
            this.fullLoading.close()
          }
          this.isNeedAuth = true
          this.$message.error({ message: error, type: 'error', duration: 6000 })
          this.logining = false
        })
    },

    async nativeLogin() {
      if (!(await awaitWrap(this.$refs.record.validate()))) {
        return
      }
      this.login()
    },

    autoLogin() {
      const { username, password } = this.$route.params
      this.isNeedAuth = !(username && password)
      if (this.isNeedAuth) {
        return
      }
      this.fullLoading = this.$loading({
        lock: true,
        text: this.$t('Base.loging'),
        spinner: 'el-icon-loading',
        background: '#fff',
      })
      this.record.username = username
      this.record.password = password
      this.login()
    },
  },
}
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  // margin: 10px;
  // width: 100vw;
  // height: 100vh;

  .emq-title {
    margin-bottom: 32px;
  }

  .el-form-item {
    margin: 42px 0;
  }

  .logo-wrapper {
    background-image: url('../../assets/emqx_banner.png');
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    height: 383px;
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
    height: 410px;
  }

  .login-card {
    width: 640px;
    flex: 0 0 auto;
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }

  .oper-wrapper {
    margin-top: 32px;
  }

  .sub-btn {
    width: 100%;
  }
}
.login-align-height {
  height: 100vh;
}
.login-align-width {
  width: 100vw;
}
</style>
