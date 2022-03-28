const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const mock = require('./script/mock.json')
const config = require('./script/config.json')

const { NODE_ENV, VUE_APP_BUILD_ENV = 'base' } = process.env

const before = (app) => {
  // 开发环境下可以使用 mock 数据
  if (NODE_ENV === 'development' && mock) {
    const { api } = mock
    api.forEach((item) => {
      app.get(`/api/v4${item.url}`, (req, res) => {
        res.json(item.data)
      })
    })
  }
}

const customConfig = {
  ...config.base,
  ...(config[VUE_APP_BUILD_ENV] || {}),
}

let { publicPath } = customConfig
if (customConfig.useRelativeResourcePath && process.env.NODE_ENV === 'production') {
  process.env.VUE_APP_PUBLIC_PATH_FOR_ROUTER = publicPath
  publicPath = './'
}

const getVersion = () => {
  const matched = process.env.npm_package_version.match(/^\d\.\d/)
  return matched ? `v${matched[0]}` : 'latest'
}
process.env.VUE_APP_VERSION = getVersion()

module.exports = {
  devServer: {
    port: 3001,
    disableHostCheck: true,
    before,
    proxy: {
      '/api': {
        // target: process.env.HOST_URL || 'http://192.168.0.234:18083',
        target: process.env.HOST_URL || 'http://127.0.0.1:18083',
        changeOrigin: true,
      },
      '/dashboard': {
        target: process.env.HOST_URL || 'http://127.0.0.1:18083/api/v4',
        changeOrigin: true,
        pathRewrite: {
          '/dashboard': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#34C388',
          'link-color': '#34C388',
        },
        javascriptEnabled: true,
      },
    },
  },
  assetsDir: 'static',
  publicPath,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        output: 'static/',
        languages: ['json', 'sql', 'plaintext', 'avro', 'protobuf', 'powershell'],
        features: ['!gotoSymbol'],
      }),
    ],
  },
}
