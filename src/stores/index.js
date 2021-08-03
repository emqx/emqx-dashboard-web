import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    get user() {
      return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')) || {}
    },
    get lang() {
      const browserLanguage = navigator.language.substring(0, 2)
      const localStorageLanguage = localStorage.getItem('language')
      return localStorageLanguage || browserLanguage || 'en'
    },
    get leftBarCollapse() {
      const collapse = localStorage.getItem('leftBarCollapse')
      return collapse === null ? false : JSON.parse(collapse)
    },
    alertCount: 0,
    get selectedModule() {
      return JSON.parse(localStorage.getItem('selectedModule')) || {}
    },
    request_queue: 0,
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
      localStorage.setItem('language', lang)
      commit('SET_LANGUAGE', lang)
      location.reload()
    },
    SET_LEFT_BAR_COLLAPSE({ commit }, collapse = false) {
      commit('SET_LEFT_BAR_COLLAPSE', !!collapse)
    },
    UPDATE_USER_INFO({ commit }, userInfo = {}) {
      const { logOut = false, remember } = userInfo
      if (logOut) {
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
      } else if (remember) {
        localStorage.setItem('user', JSON.stringify(userInfo))
      } else {
        sessionStorage.setItem('user', JSON.stringify(userInfo))
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
      state.leftBarCollapse = collapse
      localStorage.setItem('leftBarCollapse', collapse)
    },
    SET_LANGUAGE(state, lang) {
      state.lang = lang
    },
    SET_REQ_CHANGE(state, addOrDone) {
      addOrDone ? ++state.request_queue : --state.request_queue
    }
  },
})
