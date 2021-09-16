import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || {},
    lang: localStorage.getItem('language') || 'en',
    leftBarCollapse: JSON.parse(localStorage.getItem('leftBarCollapse')) || false,
    alertCount: 0,
    selectedModule: JSON.parse(localStorage.getItem('selectedModule')) || {},
    request_queue: 0,
    edition: localStorage.getItem('edition'),
  },
  actions: {
    UPDATE_MODULE({ commit }, selectedModule) {
      commit('UPDATE_MODULE', selectedModule)
    },
    SET_ALERT_COUNT({ commit }, count = 0) {
      commit('SET_ALERT_COUNT', count)
    },
    SET_LANGUAGE({ commit }, lang) {
      commit('SET_LANGUAGE', lang)
    },
    SET_LEFT_BAR_COLLAPSE({ commit }, collapse = false) {
      commit('SET_LEFT_BAR_COLLAPSE', !!collapse)
    },
    UPDATE_USER_INFO({ commit }, userInfo = {}) {
      commit('UPDATE_USER_INFO', userInfo)
    },
    SET_REQ_CHANGE({ commit }, addOrDone = true) {
      commit('SET_REQ_CHANGE', !!addOrDone)
    },
  },
  mutations: {
    UPDATE_MODULE(state, selectedModule) {
      localStorage.setItem('selectedModule', JSON.stringify(selectedModule))
      state.selectedModule = selectedModule
    },
    SET_ALERT_COUNT(state, count) {
      state.alertCount = count
    },
    UPDATE_USER_INFO(state, userInfo) {
      const { logOut = false } = userInfo
      if (logOut) {
        localStorage.removeItem('user')
      } else {
        localStorage.setItem('user', JSON.stringify(userInfo))
      }
      state.user = userInfo
    },
    SET_LEFT_BAR_COLLAPSE(state, collapse) {
      localStorage.setItem('leftBarCollapse', !!collapse)
      state.leftBarCollapse = !!collapse
    },
    SET_LANGUAGE(state, lang) {
      localStorage.setItem('language', lang)
      lang ?? localStorage.removeItem('language')
      state.lang = lang
    },
    SET_REQ_CHANGE(state, addOrDone) {
      addOrDone ? ++state.request_queue : --state.request_queue
    },
    UPDATE_EDITION(state, edition) {
      localStorage.setItem('edition', edition)
      edition ?? localStorage.removeItem('edition')
      state.edition = edition
    },
  },
  getters: {
    edition: (state) => {
      let { edition } = state
      if (!edition) return 0b10 //default to broker
      let e = String(edition).toLowerCase()
      return e == 'enterprise' ? 0b01 : 0b10
    },
  },
})
