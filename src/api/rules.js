import { omit } from 'lodash'
import http from '@/common/http'
import { fillI18n } from '@/common/utils'

let ruleEvents = []
const eventsMap = {}

export async function loadRuleEvents() {
  if (ruleEvents.length === 0) {
    const data = await http.get('/rule_events')
    ruleEvents = fillI18n(data, ['title', 'description'])
  }
  ruleEvents.forEach((event) => {
    eventsMap[event.event] = event
  })
  return ruleEvents
}

export function loadRules(params) {
  return http.get('/rules', { params })
}

export async function loadRuleDetails(id) {
  const rule = await http.get(`/rules/${encodeURIComponent(id)}`)
  await loadRuleEvents()
  rule.events = rule.for.map((item) => {
    if (!eventsMap[item]) {
      return eventsMap['$events/message_publish']
    }
    return eventsMap[item]
  })
  rule.metricsData = {}
  rule.metrics.forEach((item) => {
    ;['matched', 'speed', 'speed_last5m', 'speed_max', 'exception', 'passed', 'no_result', 'failed'].forEach((key) => {
      rule.metricsData[key] = rule.metricsData[key] || 0
      rule.metricsData[key] += item[key] || 0
    })
  })
  rule.actions = rule.actions.map((action) => {
    action.failed = 0
    action.success = 0
    action.metrics.forEach((item) => {
      action.failed += item.failed
      action.success += item.success
    })
    return action
  })
  return rule
}

export async function loadActions(options = { fillI18n: false }) {
  const actions = await http.get('/actions')
  if (!options.fillI18n) {
    return actions
  }
  return fillI18n(actions, ['title', 'description'])
}

export function destroyRule(id) {
  return http.delete(`/rules/${encodeURIComponent(id)}`)
}

export function destroyResource(id) {
  return http.delete(`/resources/${encodeURIComponent(id)}`)
}

export function reconnectResource(id, node) {
  const params = node ? { node } : undefined
  return http.post(`/resources/${encodeURIComponent(id)}`, undefined, { params })
}

export function SQLTest(rule = {}) {
  return http.post('/rules?test=true', rule, {
    params: {
      _m: false,
    },
  })
}

export async function loadActionsList(params = {}) {
  const actions = await http.get('/actions', { params })
  return actions.map((action) => {
    // eslint-disable-next-line
    action = fillI18n(action, ['title', 'description'])
    action.params = fillI18n(action.params, true)
    return action
  })
}

export async function loadResourceTypes() {
  let types = await http.get('/resource_types')
  types = fillI18n(types, ['title', 'description']).map((item) => {
    item.params = fillI18n(item.params, true)
    return item
  })
  return types
}

const resourceTypes = {}

const getNoneValue = (items) => {
  const authType = Object.keys(items)
  return authType.find((key) => Object.keys(items[key]).length === 0)
}

const getPlainValue = (items) => {
  const authType = Object.keys(items)
  return authType.find((key) => {
    const param = items[key]
    const keys = Object.keys(param)
    return !key.match(/sha/i) && keys.some((item) => item === 'password') && keys.some((item) => item === 'username')
  })
}

const handleKafkaForHotFix = (resourceItem) => {
  const { type, configVal } = resourceItem
  const kafkaSchema = resourceItem.config
  const { params } = kafkaSchema
  const { authentication_mechanism } = params
  if (type === 'bridge_kafka' && configVal.authentication_mechanism === undefined && authentication_mechanism) {
    if (!configVal.username) {
      resourceItem.configVal.authentication_mechanism = getNoneValue(authentication_mechanism.items)
    } else {
      resourceItem.configVal.authentication_mechanism = getPlainValue(authentication_mechanism.items)
    }
  }
  return resourceItem
}

export async function loadResource(params = {}) {
  if (Object.keys(resourceTypes).length === 0) {
    const types = await loadResourceTypes()
    types.forEach((item) => {
      resourceTypes[item.name] = item
    })
  }
  const resources = await http.get('/resources', { params })
  return resources.map((item) => {
    let ret = item
    const { config } = ret
    ret.configVal = config
    ret.config = resourceTypes[ret.type] || {}
    ret = handleKafkaForHotFix(ret)
    return item
  })
}

/**
 * find cfgselect fields in params
 * find fields below cfgselect by value in record
 * flat it
 * @param {Record<string,any>} config the record of resource
 * @param {*} params resource raw params
 */
const flatParams = (config, params) => {
  const ret = { ...params }
  if (!config) {
    return ret
  }
  try {
    const walkParamsBelowCfgselect = (subParams) => {
      Object.keys(subParams).forEach((subKey) => {
        const paramsItem = subParams[subKey]
        ret[subKey] = paramsItem
        if (paramsItem.type === 'cfgselect') {
          walkParamsBelowCfgselect(paramsItem.items[config[subKey]])
        }
      })
    }

    const cfgselectFieldKeyArr = Object.keys(ret).filter((key) => {
      return ret[key].type === 'cfgselect'
    })
    cfgselectFieldKeyArr.forEach((key) => {
      const value = config[key]
      const subParams = ret[key] && ret[key].items && ret[key].items[value]
      walkParamsBelowCfgselect(subParams)
    })
  } catch (error) {
    console.error(error)
  }
  return ret
}

/**
 * some field diff
 */
const handleKafkaForHotFixInDetailPage = (resourceItem) => {
  const { type, config } = resourceItem
  const kafkaSchema = resourceItem.typeInfo
  const { params } = kafkaSchema
  const { authentication_mechanism } = params
  if (type === 'bridge_kafka' && config.authentication_mechanism === undefined && authentication_mechanism) {
    if (!config.username) {
      resourceItem.config.authentication_mechanism = getNoneValue(authentication_mechanism.items)
      resourceItem.config = omit(resourceItem.config, ['username', 'password'])
    } else {
      resourceItem.config.authentication_mechanism = getPlainValue(authentication_mechanism.items)
    }
  }
  return resourceItem
}

export async function loadResourceDetails(id) {
  if (Object.keys(resourceTypes).length === 0) {
    const types = await loadResourceTypes()
    types.forEach((item) => {
      resourceTypes[item.name] = item
    })
  }
  try {
    let resource = await http.get(`/resources/${encodeURIComponent(id)}`)
    resource.typeInfo = resourceTypes[resource.type] || {}
    resource = handleKafkaForHotFixInDetailPage(resource)
    resource._config = []
    const flattenParams = flatParams(resource.config, resource.typeInfo.params)
    Object.keys(resource.config).forEach((key) => {
      const value = resource.config[key]
      const { title, description, type } = flattenParams[key] || {}
      resource._config.push({
        key,
        value,
        title: title || value,
        description,
        type,
      })
    })
    return resource
  } catch (error) {
    console.error(error)
    return false
  }
}

export function createResource(resource = {}, test = false) {
  return http.post('/resources', resource, {
    params: {
      test: test ? 'true' : undefined,
    },
  })
}

export function editResource(resource = {}) {
  return http.put(`/resources/${encodeURIComponent(resource.id)}`, resource)
}

export function createRule(rule = {}) {
  return http.post('/rules', rule)
}

export function updateRule(id, rule = {}) {
  return http.put(`/rules/${encodeURIComponent(id)}`, rule)
}

export function resetRuleStatistics(id) {
  return http.put(`/rules/${encodeURIComponent(id)}/reset_metrics`)
}

export default {}
