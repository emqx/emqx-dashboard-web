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

module.exports = {
  devServer: {
    port: 3001,
    disableHostCheck: true,
    before,
    proxy: {
      '/api': {
        target: process.env.HOST_URL || 'http://127.0.0.1:18083',
        changeOrigin: true,
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
  publicPath: customConfig.publicPath,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        output: 'static/',
        languages: ['json', 'sql', 'plaintext', 'avro', 'protobuf'],
      }),
    ],
  },
}
