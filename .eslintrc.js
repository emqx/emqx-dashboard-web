module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': 0,
    'vue/max-attributes-per-line': [4, {
      singleline: 6,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'never',
        component: 'never',
      },
      svg: 'never',
      math: 'never',
    }],
    semi: 0,
    'import/no-cycle': 0,
    'max-len': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': ['error', {'object': true, 'array': false}],
    'no-param-reassign': ['error', { 'props': false }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
