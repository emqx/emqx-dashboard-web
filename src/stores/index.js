import Vue from 'vue'
import Vuex from 'vuex'

// import config from '../../script/config'

Vue.use(Vuex)

const BASE_ENV = 'base'

function checkLanguage(lang) {
  if (['en', 'zh'].includes(lang)) {
    return lang
  }
  return ''
}
function getDefaultLanguage() {
  const browserLanguage = checkLanguage(navigator.language.substr(0, 2))
  const localStorageLanguage = checkLanguage(localStorage.getItem('language'))
  const defaultLanguage = (window.EMQX_CONFIG || {}).language
  return localStorageLanguage || defaultLanguage || browserLanguage || 'en'
}
// function getConfigState() {
//   const buildEnv = process.env.VUE_APP_BUILD_ENV || BASE_ENV
//   const envConfig = config[buildEnv] || config.base

//   return {
//     ...config.base,
//     ...envConfig,
//   }
// }
function getNavTabs() {
  return JSON.parse(localStorage.getItem('navTabs')) || []
}
function getCollapse() {
  const collapse = localStorage.getItem('leftBarCollapse')
  if (collapse === null) {
    return false
  }
  return JSON.parse(collapse)
}

export default new Vuex.Store({
  state: {
    loading: false,
    user: JSON.parse(localStorage.user || sessionStorage.user || '{}') || {},
    lang: getDefaultLanguage(),
    leftBarCollapse: getCollapse(),
    alertCount: 0,
    // config: getConfigState(),
    navTabs: getNavTabs(),
    selectedModule: JSON.parse(localStorage.getItem('selectedModule')) || {},
  },
  actions: {
    UPDATE_MODULE({ commit }, selectedModule) {
      localStorage.setItem('selectedModule', JSON.stringify(selectedModule))
      commit('UPDATE_MODULE', selectedModule)
    },
    // UPDATE_CONFIG({ commit }, customConfig) {
    //   commit('UPDATE_CONFIG', customConfig)
    // },
    SET_ALERT_COUNT({ commit }, count = 0) {
      commit('SET_ALERT_COUNT', count)
    },
    SET_LANGUAGE({ commit }, lang = 'en') {
      localStorage.setItem('language', lang)
      commit('SET_LANGUAGE', lang)
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
    ADD_NAV_TABS({ commit }, tab) {
      commit('ADD_NAV_TABS', tab)
    },
    REMOVE_NAV_TABS({ commit, state }, tab) {
      const tabs = [...state.navTabs]
      for (const [index, value] of tabs.entries()) {
        if (value.url === tab.url) {
          tabs.splice(index, 1)
          break
        }
      }
      commit('REMOVE_NAV_TABS', tabs)
      return tabs
    },
  },
  mutations: {
    UPDATE_MODULE(state, selectedModule) {
      state.selectedModule = selectedModule
    },
    // UPDATE_CONFIG(state, customConfig) {
    //   state.config = customConfig
    // },
    SET_ALERT_COUNT(state, count) {
      state.alertCount = count
    },
    UPDATE_USER_INFO(state, userInfo) {
      state.user = userInfo
    },
    LOADING(state, loading) {
      state.loading = loading
    },
    SET_LEFT_BAR_COLLAPSE(state, collapse) {
      state.leftBarCollapse = collapse
      localStorage.setItem('leftBarCollapse', collapse)
    },
    SET_LANGUAGE(state, lang) {
      state.lang = lang
    },
    ADD_NAV_TABS(state, tab) {
      state.navTabs.push(tab)
      localStorage.setItem('navTabs', JSON.stringify(state.navTabs))
    },
    REMOVE_NAV_TABS(state, tabs) {
      state.navTabs = tabs
      localStorage.setItem('navTabs', JSON.stringify(state.navTabs))
    },
  },
})
