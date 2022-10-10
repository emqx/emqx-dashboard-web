import AES from 'crypto-js/aes'
import encUTF8 from 'crypto-js/enc-utf8'

/**
 * key for set/get local storage
 */
const USER_INFO_KEY = 'uK'
const ENCRYPTION_KEY = 'eK'

const parseJSONSafely = (str) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    console.error('An error occurred while parsing the JSON string')
  }
}

const stringifyObjSafely = (obj, tabSpaces = 2) => {
  try {
    if (typeof obj === 'string') {
      return obj
    }
    return JSON.stringify(obj, null, tabSpaces)
  } catch (error) {
    console.error(error)
    return 'stringify error'
  }
}

const ZERO_ASCII = 48
const LOWER_A_ASCII = 97
const charLib = String.fromCharCode(
  ...new Array(10)
    .fill(ZERO_ASCII)
    .map((item, index) => item + index)
    .concat(new Array(26).fill(LOWER_A_ASCII).map((item, index) => item + index)),
)

const createRandomString = (length = 8) => {
  const libLength = charLib.length
  return new Array(length).fill('').reduce((str) => {
    const randomIndex = Math.floor(Math.random() * libLength)
    return str + charLib.substring(randomIndex, randomIndex + 1)
  }, '')
}

const getUserInfoKey = () => {
  return localStorage.getItem(USER_INFO_KEY)
}

const setUserInfoKey = () => {
  const uk = createRandomString(8)
  localStorage.setItem(USER_INFO_KEY, uk)
  return uk
}

const getEncryptionKey = () => {
  return localStorage.getItem(ENCRYPTION_KEY)
}

const setEncryptionKey = () => {
  const ek = createRandomString(10)
  localStorage.setItem(ENCRYPTION_KEY, ek)
  return ek
}

const encryptSafely = (str, key) => {
  try {
    return AES.encrypt(str, key)
  } catch (error) {
    console.error(error)
    return str
  }
}

const decryptSafely = (str, key) => {
  try {
    const bytes = AES.decrypt(str, key)
    return bytes.toString(encUTF8)
  } catch (error) {
    console.error(error)
    return str
  }
}

/**
 * 1. generate uk
 * 2. generate ek
 * 3. set user info
 */
export const setUser = (user, remember) => {
  const uk = setUserInfoKey()
  const ek = setEncryptionKey()
  const userInfo = encryptSafely(stringifyObjSafely(user), ek)
  if (remember) {
    localStorage.setItem(uk, userInfo)
  } else {
    sessionStorage.setItem(uk, userInfo)
  }
}

export const getUser = () => {
  const uk = getUserInfoKey()
  const ek = getEncryptionKey()
  if (!uk || !ek) {
    return undefined
  }
  const user = localStorage.getItem(uk) || sessionStorage.getItem(uk)
  if (!user) {
    return undefined
  }
  const userInfoStr = decryptSafely(user, ek)
  const userInfo = parseJSONSafely(userInfoStr)
  return userInfo
}

export const removeUser = () => {
  const uk = getUserInfoKey()
  if (!uk) {
    return
  }
  localStorage.removeItem(uk)
  sessionStorage.removeItem(uk)

  localStorage.removeItem(USER_INFO_KEY)
  localStorage.removeItem(ENCRYPTION_KEY)
}
