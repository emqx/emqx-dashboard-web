import http from '@/common/http'
import { fillI18n } from '@/common/utils'
import EMQXEvents from '@/common/emqx_events'

export function loadRules(params) {
  return http.get('/rules', params)
}

export function loadRuleDetails(id) {
  return http.get(`/rules/${id}`)
}

export async function loadActions(options = { fillI18n: false }) {
  const actions = await http.get('/actions')
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

export function loadEventsSelect() {
  const events = JSON.parse(JSON.stringify(EMQXEvents)).map($ => ({ label: $.name, value: $.value }))
  return fillI18n(events, ['label'])
}

export function loadEvents() {
  return fillI18n(JSON.parse(JSON.stringify(EMQXEvents)), ['name'])
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

export async function loadResource(params = {}) {
  if (Object.keys(resourceTypes).length === 0) {
    const types = await loadResourceTypes()
    types.forEach((item) => {
      resourceTypes[item.name] = item
    })
  }
  let resources = await http.get('/resources', { params })
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
  let resource = await http.get(`/resources/${id}`)
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

export default {}
