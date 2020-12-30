import http from '@/common/http'
import { fillI18n, getJpData } from '@/common/utils'
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash'
import store from '@/stores'

let ruleEvents = []
const eventsMap = {}
const { lang } = store.state

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
  return http.get('/rules', params)
}

export async function loadRuleDetails(id) {
  const rule = await http.get(`/rules/${id}`)
  await loadRuleEvents()
  rule.events = rule.for.map((item) => {
    if (!eventsMap[item]) {
      return eventsMap['$events/message_publish']
    }
    return eventsMap[item]
  })
  rule.metricsData = {}
  rule.metrics.forEach((item) => {
    ;['matched', 'speed', 'speed_last5m', 'speed_max'].forEach((key) => {
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
  if (lang === 'ja') {
    const jpData = getJpData('actions')
    actions.forEach((item) => {
      jpData.forEach((one) => {
        if (one.name === item.name) {
          _.merge(item, one)
        }
      })
    })
  }
  if (!options.fillI18n) {
    return actions
  }
  return fillI18n(actions, ['title', 'description'])
}

export function destroyRule(id) {
  return http.delete(`/rules/${id}`)
}

export function destroyResource(id) {
  return http.delete(`/resources/${id}`)
}

export function reconnectResource(id) {
  return http.post(`/resources/${id}`)
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
  if (lang === 'ja') {
    const jpData = getJpData('actions')
    actions.forEach((item) => {
      jpData.forEach((one) => {
        if (one.name === item.name) {
          _.merge(item, one)
        }
      })
    })
  }
  return actions.map((action) => {
    // eslint-disable-next-line
    action = fillI18n(action, ['title', 'description'])
    action.params = fillI18n(action.params, true)
    return action
  })
}

export async function loadResourceTypes() {
  let types = await http.get('/resource_types')
  if (lang === 'ja') {
    const jpData = getJpData('resourceTypes')
    types.forEach((item) => {
      jpData.forEach((one) => {
        if (one.name === item.name) {
          _.merge(item, one)
        }
      })
    })
  }
  types = fillI18n(types, ['title', 'description']).map((item) => {
    item.params = fillI18n(item.params, true)
    return item
  })
  return types
}

const resourceTypes = {}

export async function loadResource(params = {}) {
  if (Object.keys(resourceTypes).length === 0) {
    const types = await loadResourceTypes()
    types.forEach((item) => {
      resourceTypes[item.name] = item
    })
  }
  const resources = await http.get('/resources', { params })
  return resources.map((item) => {
    item.config = resourceTypes[item.type] || {}
    return item
  })
}

export async function loadResourceDetails(id) {
  if (Object.keys(resourceTypes).length === 0) {
    const types = await loadResourceTypes()
    types.forEach((item) => {
      resourceTypes[item.name] = item
    })
  }
  try {
    const resource = await http.get(`/resources/${id}`)
    resource.typeInfo = resourceTypes[resource.type] || {}
    resource._config = []
    Object.keys(resource.config).forEach((key) => {
      const value = resource.config[key]
      const { title, description } = resource.typeInfo.params[key] || {}
      resource._config.push({
        key,
        value,
        title: title || value,
        description,
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

export function createRule(rule = {}) {
  return http.post('/rules', rule)
}

export function updateRule(id, rule = {}) {
  return http.put(`/rules/${id}`, rule)
}

export default {}
