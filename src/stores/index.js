import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    get user() {
      return JSON.parse(localStorage.getItem('user')) || {}
    },
    get lang() {
      const browserLanguage = navigator.language.substring(0, 2)
      const localStorageLanguage = localStorage.getItem('language')
      return localStorageLanguage || browserLanguage || 'en'
    },
    // set lang(val) {
    //   localStorage.setItem('language', val)
    //   val ?? localStorage.removeItem('language')
    // },
    get leftBarCollapse() {
      const collapse = localStorage.getItem('leftBarCollapse')
      return collapse === null ? false : JSON.parse(collapse)
    },
    // set leftBarCollapse(val) {
    //   localStorage.setItem('leftBarCollapse', val)
    // },
    alertCount: 0,
    get selectedModule() {
      return JSON.parse(localStorage.getItem('selectedModule')) || {}
    },
    request_queue: 0,
    get edition() {
      return localStorage.getItem('edition')
    },
    // set edition(v) {
    //   localStorage.setItem('edition', v)
    //   v ?? localStorage.removeItem('edition')
    // },
  },
  actions: {
    UPDATE_MODULE({ commit }, selectedModule) {
      localStorage.setItem('selectedModule', JSON.stringify(selectedModule))
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
      const { logOut = false } = userInfo
      if (logOut) {
        localStorage.removeItem('user')
      } else {
        localStorage.setItem('user', JSON.stringify(userInfo))
      }
      commit('UPDATE_USER_INFO', logOut ? {} : userInfo)
    },
    SET_REQ_CHANGE({ commit }, addOrDone = true) {
      commit('SET_REQ_CHANGE', !!addOrDone)
    },
  },
  mutations: {
    UPDATE_MODULE(state, selectedModule) {
      state.selectedModule = selectedModule
    },
    SET_ALERT_COUNT(state, count) {
      state.alertCount = count
    },
    UPDATE_USER_INFO(state, userInfo) {
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
