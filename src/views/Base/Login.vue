<template>
  <div class="login">
    <a-card v-if="isNeedAuth" class="login-card emq-list-card">
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
            :show-message="false"
            @keyup.enter.native="getSMS(false, $event)"
          >
            <el-alert v-if="sendSMSError" :title="sendSMSError" type="error" @close="sendSMSError = ''" />

            <el-form-item prop="username">
              <el-input v-model="record.username" :placeholder="$t('Base.userName')" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="record.password" type="password" :placeholder="$t('Base.password')" />
            </el-form-item>

            <el-checkbox v-model="record.remember">{{ $t('Base.remember') }}</el-checkbox>

            <el-form-item class="oper-wrapper" label="">
              <el-button class="sub-btn" type="primary" @click="getSMS(false, $event)" :loading="isSendingMsg">
                {{ $t('Base.signIn') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </a-card>
    <el-dialog
      width="500px"
      class="code-form"
      :close-on-click-modal="false"
      :title="$t('Base.SMSConfirm')"
      :visible.sync="showCodeDialog"
      @close="initCodeDialog"
    >
      <p>{{ $t('Base.SMSConfirmText', { phone: userPhone }) }}</p>
      <el-alert v-if="loginError" :title="loginError" type="error" @close="loginError = ''" />
      <el-form ref="codeForm" :model="codeForm" :rules="codeRules" @submit.native.prevent @keyup.enter.native="login">
        <el-form-item prop="code">
          <el-input v-model="codeForm.code" />
        </el-form-item>
      </el-form>
      <el-button size="medium" :disabled="!!SMSNeedWait" :loading="isResending" @click="getSMS(true, $event)">
        {{ $t('Base.resendVerificationCode') }}
        <template v-if="!!SMSNeedWait">({{ $t('Base.waitSecond', { s: SMSNeedWait }) }})</template>
      </el-button>
      <template slot="footer">
        <el-button @click="showCodeDialog = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="login" :loading="isLoading">{{ $t('Base.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { auth, requestSendSMS } from '@/api/common'
import { awaitWrap } from '@/common/utils'
import store from '@/stores'
import { DEFAULT_PWD } from '@/common/constants'

const timeReg = /timeout[^\d]+(\d+)/
const getTimeFromMessage = (msg) => {
  const time = msg.match(timeReg)
  return time && time[1] ? time[1] : undefined
}

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
      sendSMSError: '',
      rules: {
        username: { required: true },
        password: { required: true },
      },
      isNeedAuth: true,
      fullLoading: false,
      fromCloud: false,
      isSendingMsg: false,
      isResending: false,
      SMSNeedWait: undefined,

      showCodeDialog: false,
      userPhone: '',
      codeForm: { code: '' },
      codeRules: { code: [{ required: true, message: this.$t('Base.codeRequired') }] },
      isLoading: false,
      loginError: '',
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

  methods: {
    async getSMS(isResend = false) {
      if (!(await awaitWrap(this.$refs.record.validate()))) {
        return
      }
      if (this.SMSNeedWait) {
        return
      }
      this.sendSMSError = ''
      const { username, password } = this.record
      try {
        if (isResend) {
          this.isResending = true
        } else {
          this.isSendingMsg = true
        }
        this.userPhone = await requestSendSMS({ username, password })
        if (!isResend) {
          this.codeForm.code = ''
          this.showCodeDialog = true
        }
        this.SMSNeedWait = 60
        this.decreaseSMSWait()
      } catch (error) {
        const seconds = getTimeFromMessage(error)
        if (seconds) {
          this.sendSMSError = this.$t('Base.SMSTooMuchError', { s: seconds })
        } else {
          this.sendSMSError = this.$t('Base.SMSError', { s: seconds })
        }
      } finally {
        if (isResend) {
          this.isResending = false
        } else {
          this.isSendingMsg = false
        }
      }
    },
    async login() {
      await this.$refs.codeForm.validate()
      const { username, password, remember } = this.record
      this.isLoading = true
      auth({
        username: this.record.username,
        code: this.codeForm.code,
      })
        .then((res) => {
          if (!res) {
            return
          }
          this.loginError = ''
          const { is_default_password } = res
          if (is_default_password && this.isNeedAuth) {
            this.needChangePwd = true
            return
          }

          // TODO:confirm
          const token = res
          const isUsingDefaultPwd = password === DEFAULT_PWD
          this.$store.dispatch('UPDATE_USER_INFO', { username, token, remember, isUsingDefaultPwd })
          this.isLoading = false

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
          this.loginError = error
          this.isLoading = false
        })
    },

    decreaseSMSWait() {
      const decrease = () => {
        this.SMSNeedWait -= 1
        if (this.SMSNeedWait > 0) {
          window.setTimeout(decrease, 1000)
        } else {
          this.SMSNeedWait = undefined
        }
      }
      decrease()
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

    initCodeDialog() {
      this.codeForm.code = ''
      this.userPhone = ''
    },
  },
}
</script>

<style lang="scss">
.login {
  width: 100vw;
  min-height: 100vh;
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);

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
    background-image: url('../../assets/emqx_banner.png');
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

  .sub-btn {
    width: 100%;
  }
}
.code-form {
  .el-alert {
    margin-bottom: 12px;
  }
  .el-form-item {
    margin: 0 0 24px;
  }
}
</style>
