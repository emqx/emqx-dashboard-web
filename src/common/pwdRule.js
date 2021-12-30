import lang from '@/i18n'
import store from '@/stores'

const local = store.state.lang
const VueI18n = lang[local]

export const pwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_]{8,32}$/

/**
 * @param comparisonFunc A function that compares whether the new password is consistent with the confirmed password.
 */
export default (comparisonFunc) => {
  return {
    newPassword: [
      {
        required: true,
        message: VueI18n.General.pleaseEnterNewPassword,
        trigger: ['blur', 'change'],
      },
      {
        pattern: pwdRegExp,
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
