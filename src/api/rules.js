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

export function loadEventsSelect() {
  const events = JSON.parse(JSON.stringify(EMQXEvents)).map($ => ({ label: $.name, value: $.value }))
  return fillI18n(events, ['label'])
}

export function loadEvents() {
  return fillI18n(JSON.parse(JSON.stringify(EMQXEvents)), ['name'])
}

export default {}
