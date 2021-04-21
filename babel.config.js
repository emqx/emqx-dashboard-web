module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'usage',
        target: {
          chrome: 78,
          firefox: 75,
          ie: 11,
        },
        corejs: '3.10',
      },
    ],
  ],
  plugins: [],
}
