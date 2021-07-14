<template>
  <div
    :class="[
      'login',
      loginKeepHeight && 'login-align-height',
      loginKeepWidth && 'login-align-width',
    ]"
  >
    <el-card shadow="never" class="login-card emq-list-card" id="login">
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
              <el-input
                v-model="record.username"
                :placeholder="$t('Base.userName')"
                tabindex="1"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="record.password"
                type="password"
                :placeholder="$t('Base.password')"
                tabindex="2"
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
import { getBasicAuthInfo } from '@/common/utils'

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
      loginKeepHeight: false,
      loginKeepWidth: false,
    }
  },

  computed: {},

  created() {
    this.login(true)
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
    login(auto = false) {
      const { username, password, remember } = (auto && getBasicAuthInfo()) || this.record
      auto && username && password && this.redirect()

      if (!auto) {
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

            setTimeout(this.redirect, 200)
          })
          .catch((error) => {
            this.$message({ message: error, type: 'error', duration: 6000 })
            this.logining = false
          })
      }
    },
    redirect() {
      const { to = '/' } = this.$route.query
      this.$router.replace({
        path: to,
      })
    },
    async nativeLogin() {
      ;(await this.$refs.record.validate().catch(() => {})) && this.login()
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
    width: 44%;
    float: left;
    padding: 3%;
    height: 370px;
    overflow: hidden;
  }

  .login-card {
    width: 640px;
    flex: 0 0 auto;
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }

  .oper-wrapper {
    margin-top: 32px;
    margin-bottom: 12px;
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
