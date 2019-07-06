module.exports = {
  devServer: {
    disableHostCheck: true,
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
