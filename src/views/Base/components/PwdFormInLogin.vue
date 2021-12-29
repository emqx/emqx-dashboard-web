<template>
  <div :span="12" class="login-wrapper pwd-form-in-login">
    <div class="emq-title">
      {{ $t('Base.signIn') }}
      <div class="sub-title">
        {{ type === 'default' ? $t('Base.defaultPwdTip') : $t('Base.weakPwdTip') }}
      </div>
    </div>
    <el-form ref="formCom" :model="record" :rules="rules" hide-required-asterisk @keyup.enter.native="submit">
      <el-form-item prop="pwd">
        <el-input v-model="record.pwd" type="password" :placeholder="$t('General.newPassword')"></el-input>
      </el-form-item>
      <el-form-item prop="pwdConfirm">
        <el-input v-model="record.pwdConfirm" type="password" :placeholder="$t('General.confirmPassword')"></el-input>
      </el-form-item>
      <el-button class="sub-btn" type="primary" @click="submit">{{ $t('General.changePassword') }}</el-button>
      <el-button class="btn-skip" @click="skip" type="text">{{ $t('Base.skip') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import pwdRule from '@/common/pwdRule'

export default {
  name: 'PwdFormInLogin',
  props: {
    // 'weak' || 'default'
    type: String,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('General.pleaseEnterYourPasswordAgain')))
      } else if (value !== this.record.pwd) {
        callback(new Error(this.$t('General.confirmNotMatch')))
      } else {
        callback()
      }
    }
    const { newPassword, repeatPassword } = pwdRule(validatePass)
    return {
      record: {
        pwd: '',
        pwdConfirm: '',
      },
      rules: {
        pwd: newPassword,
        pwdConfirm: repeatPassword,
      },
    }
  },
  methods: {
    async submit() {
      await this.$refs.formCom.validate()
      this.$emit('submit', this.record.pwd)
    },
    skip() {
      this.$emit('skip')
    },
  },
}
</script>

<style lang="scss">
.pwd-form-in-login {
  .btn-skip {
    margin-top: 12px;
    margin-left: 0;
  }
}
</style>
