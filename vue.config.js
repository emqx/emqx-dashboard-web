const mock = require('./script/mock.json')

const { NODE_ENV } = process.env

const before = (app) => {
  // 开发环境下可以使用 mock 数据
  if (NODE_ENV === 'development' && mock) {
    const { api } = mock
    api.forEach((item) => {
      app.get(`/api/v3${item.url}`, (req, res) => {
        res.json(item.data)
      })
    })
  }
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
  productionSourceMap: false,
}
