import lang from '@/i18n'
import store from '@/stores'

const local = store.state.lang
const VueI18n = lang[local]

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
        min: 3,
        max: 32,
        message: VueI18n.General.passwordLength,
        trigger: ['blur', 'change'],
      },
    ],
    repeatPassword: [
      { required: true, message: VueI18n.General.pleaseEnterAConfirmationPassword },
      { validator: comparisonFunc, trigger: ['blur'] },
    ],
  }
}
