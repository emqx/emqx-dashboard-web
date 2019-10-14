import config from '../script/config'

const buildEnv = process.env.VUE_APP_BUILD_ENV || window.EMQX_DASHBOARD_ENV
const envConfig = config[buildEnv] || config.base

// https://github.com/vuejs/vue-loader/issues/1337
export default {
  ...config.base,
  ...envConfig,
}
