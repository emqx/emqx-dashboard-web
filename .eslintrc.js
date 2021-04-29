module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'plugin:vue/strongly-recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-debugger': 'off',
    'import/extensions': 0,
    'vue/no-v-html': 'off',
    semi: 0,
    'import/no-cycle': 0,
    'max-len': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-param-reassign': ['error', { props: false }],
    camelcase: 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
