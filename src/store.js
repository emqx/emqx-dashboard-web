import Vue from 'vue'
import Vuex from 'vuex'

import { safeParser, getDefaultLanguage } from '@/common/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    user: JSON.parse(localStorage.user || sessionStorage.user || '{}') || {},
    lang: getDefaultLanguage(),
    leftBarCollapse: false, // localStorage.getItem('leftBarCollapse'),
    alertCount: 0
  },
  actions: {
    SET_ALERT_COUNT({ commit }, count = 0) {
      commit('SET_ALERT_COUNT', count)
    },
    SET_LANGUAGE({ commit }, lang = 'en') {
      localStorage.setItem('language', lang)
      commit('SET_LANGUAGE', lang)
      console.log('SET_LANGUAGE')
      setTimeout(() => {
        location.reload()
      }, 400)
    },
    SET_LEFT_BAR_COLLAPSE({ commit }, collapse = false) {
      // localStorage.setItem('leftBarCollapse', collapse ? 'true' : '')
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
    LOADING({ commit }, loading = false) {
      commit('LOADING', loading)
    },
  },
  mutations: {
    SET_ALERT_COUNT(state, count) {
      state.alertCount = count
    },
    UPDATE_USER_INFO(state, userInfo) {
      // eslint-disable-next-line
      state.user = userInfo
    },
    LOADING(state, loading) {
      // eslint-disable-next-line
      state.loading = loading
    },
    SET_LEFT_BAR_COLLAPSE(state, collapse) {
      // eslint-disable-next-line
      state.leftBarCollapse = collapse
    },
    SET_LANGUAGE(state, lang) {
      state.lang = lang
    },
  },
})
