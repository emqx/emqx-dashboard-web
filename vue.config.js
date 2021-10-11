const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
// const mock = require('./script/mock.json')
// const config = require('./script/config.json')

// const { NODE_ENV, VUE_APP_BUILD_ENV = 'base' } = process.env

// const before = (app) => {
//   // 开发环境下可以使用 mock 数据
//   if (NODE_ENV === 'development' && mock) {
//     const { api } = mock
//     api.forEach((item) => {
//       app.get(`/api/v4${item.url}`, (req, res) => {
//         res.json(item.data)
//       })
//     })
//   }
// }

// const customConfig = {
//   ...config.base,
//   ...(config[VUE_APP_BUILD_ENV] || {}),
// }

module.exports = {
  devServer: {
    port: 4000,
    disableHostCheck: true,
    // before,
    proxy: {
      '/api/v5': {
        target: 'http://34.219.115.160:18083/',
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {},
  },
  assetsDir: 'static',
  runtimeCompiler: true,
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        publicPath: 'static/',
        languages: ['json', 'sql', 'plaintext', 'avro', 'protobuf'],
        features: ['wordHighlighter'],
      }),
    ],
  },
}
