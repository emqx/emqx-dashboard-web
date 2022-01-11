import { login } from '@/api/common'
import { toLogin, getBasicAuthInfo } from '../common/utils'
// Before entering the page, check whether the user is the default password;
// in order to prevent the user from modifying the default password after logging in,
// open another tab to achieve the purpose of skipping the password modification step

const checkIsDefaultPwd = async () => {
  const { username, password } = getBasicAuthInfo()
  if (!username) {
    // do not handle it
    return
  }
  const { is_default_password, is_weak_password } = await login({ username, password })
  if (is_default_password || is_weak_password) {
    toLogin()
  }
}

export default checkIsDefaultPwd
