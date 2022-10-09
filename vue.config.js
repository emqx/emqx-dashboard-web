const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const mock = require('./script/mock.json')
const config = require('./script/config.json')

const { NODE_ENV, VUE_APP_BUILD_ENV = 'base' } = process.env

function resolve(dir) {
  return path.join(__dirname, dir)
}
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
const name = 'emqxDashBoard-bc'
if (VUE_APP_BUILD_ENV === 'sub-app') {
  publicPath = '/integration/emqx-dashboard/v4.4.0-bc/'
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
        target: process.env.HOST_URL || 'http://localhost:18083',
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
    headers: {
      'Access-Control-Allow-Origin': '*',
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
    output: {
      // 把子应用打包成 umd 库格式
      // 必须打包成一个库文件
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
    resolve: {
      alias: {
        '@': resolve('src'),
      },
      // 导入时想要省略的扩展名列表
      // 不建议使用 .vue 影响IDE和类型支持
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  },
  chainWebpack: (config) => {
    config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end()
    config.module.rule('images').use('url-loader').loader('url-loader').options({}).end()
  },
}
