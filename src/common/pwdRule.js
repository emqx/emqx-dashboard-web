import lang from '@/i18n'
import store from '@/stores'

const local = store.state.lang
const VueI18n = lang[local]

/**
 * @param comparisonFunc A function that compares whether the new password is consistent with the confirmed password.
 */
export default (comparisonFunc) => {
  const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_]{8,32}$/
  return {
    newPassword: [
      {
        required: true,
        message: VueI18n.General.pleaseEnterNewPassword,
        trigger: ['blur', 'change'],
      },
      {
        pattern: regExp,
        message: VueI18n.General.pwdRegExpError,
        trigger: ['blur'],
      },
    ],
    repeatPassword: [
      { required: true, message: VueI18n.General.pleaseEnterAConfirmationPassword },
      { validator: comparisonFunc, trigger: ['blur'] },
    ],
  }
}
