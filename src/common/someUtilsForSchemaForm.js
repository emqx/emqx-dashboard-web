/**
 * @param {ParamItem} param
 * @param {boolean}
 */
export const isParamBoolType = (param) => {
  const { bindAttributes } = param
  const optList = (bindAttributes && bindAttributes.field && bindAttributes.field.list) || []
  const isBoolOpts = optList.length >= 2 && [true, false].every((item) => optList.includes(item))
  return isBoolOpts
}

/**
 * @param {ParamItem} param
 * @returns {boolean}
 */
export const isParamSSLType = (param) => {
  const fileTypeFieldsButNotForSSL = ['kerberos_keytab']
  return (
    (param.elType === 'file' && !fileTypeFieldsButNotForSSL.includes(param.key)) ||
    ['verify', 'tls_version', 'server_name_indication'].includes(param.key)
  )
}

export const findParamItemByKey = (paramList, keyForFind) => {
  return paramList.find(({ key }) => keyForFind === key) || {}
}

const fieldTypesWider = ['textarea', 'object', 'file', 'array', 'binary_file']
export const getParamItemSpan = (param) => {
  return fieldTypesWider.includes(param.type) ? 24 : 12
}

export default {}
