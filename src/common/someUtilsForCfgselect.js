import _ from 'lodash'

export const findCurrentExtraConfigParams = (originParamList, nowParamList) => {
  const commonParamsKeyList = originParamList.map(({ key }) => key)
  return _.cloneDeep(
    nowParamList.filter(({ key }) => {
      return !commonParamsKeyList.includes(key)
    }),
  )
}

/**
 * @param {Array<ParamItem>} paramList
 * @param {Array<string>} keyList
 * @returns {Array<ParamItem>}
 */
export const deleteParamsByKeys = (paramList, keyList) => {
  return paramList.filter(({ key }) => {
    return !keyList.includes(key)
  })
}

/**
 * @param {Record<string,RuleItem>} originRules
 * @param {Record<string,RuleItem>} nowRules
 * @returns {Record<string,RuleItem>}
 */
export const findCurrentExtraRules = (originRules, nowRules) => {
  const commonRulesKeyList = Object.keys(originRules)
  const extraRulesKeys = Object.keys(nowRules).filter((key) => !commonRulesKeyList.includes(key))
  return _.cloneDeep(_.pick(nowRules, extraRulesKeys))
}

/**
 * @param {Record<string,RuleItem>} rules
 * @param {Array<string>} keyList
 * @returns {Record<string,RuleItem>}
 */
export const deleteRulesByKeys = (rules, keyList) => {
  const keysNeed = Object.keys(rules).filter((item) => {
    return !keyList.includes(item)
  })
  return _.pick(rules, keysNeed)
}

/**
 * @param {Record<string,ParamItem>} allExtraParams all extra params of a cfgselect field
 * @param {string} usedFieldValue current selected value in a cfgselect field
 * @returns {Record<string,ParamItem>}
 */
export const getOtherExtraConfigs = (allExtraParams, usedFieldValue) => {
  const keys = Object.keys(allExtraParams).filter((key) => key !== usedFieldValue)
  return keys.reduce((obj, key) => {
    return { ...obj, ...allExtraParams[key] }
  }, {})
}

/**
 * @param {Array<ParamItem>} paramList
 */
export const deduplicateParams = (paramList) => {
  const keyList = []
  return paramList.reduce((arr, item) => {
    if (keyList.includes(item.key)) {
      return arr
    }
    keyList.push(item.key)
    return [...arr, item]
  }, [])
}

/**
 * find out which fields need to be added and which fields need to be deleted
 * (i think this func is useless but i am afraid to delete it even it is write by myself...)
 * @param {Array<ConfigItem>} oldConfig
 * @param {Array<ConfigItem>} newConfig
 * @returns {needAdded:Array<string>,needDeleted:Array<string>}
 */
export const diffConfigList = (oldConfig, newConfig) => {
  const oldKeys = oldConfig.map(({ key }) => key)
  const newKeys = newConfig.map(({ key }) => key)
  const needDeleted = oldKeys.filter((oldItem) => !newKeys.some((newItem) => newItem === oldItem))
  const needAdded = newKeys.filter((newItem) => !oldKeys.some((oldItem) => oldItem === newItem))
  return {
    needDeleted,
    needAdded,
  }
}

export default {}
