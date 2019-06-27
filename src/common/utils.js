/* eslint-disable */
import store from '@/store'
import router from '@/router'

export function getBasicAuthInfo() {
  return store.state.user
}

export function toLogin() {
  store.dispatch('UPDATE_USER_INFO', { logOut: true })
  router.push({ path: '/login', query: { to: router.fullPath } })
}

export const awaitWrap = promise => promise
.then(data => data)
.catch(err => null)

export function safeParser(jsonStr, defaultValue = {}) {
  try {
    return JSON.parse(jsonStr) || defaultValue
  } catch (e) {
    return defaultValue
  }
}

function fillObjectI18n(data = {}) {
  const { lang = 'zh' } = store.state

  Object.keys(data).forEach(key => {
    let value = data[key]
    if (typeof value !== 'object') {
      return
    }
    if ('en' in value && 'zh' in value) {
      data[key] = value[lang]
    } else {
      fillObjectI18n(value)
    }
  })
  return data
}

// 将 [{ title: { en: 'Title', zh: '标题' } }] 翻译为 [{ title: '标题' }]
export function fillI18n(data = [], keys = [], autoSearch = false) {
  if (!data) {
    return data
  }
  const { lang = 'zh' } = store.state
  const dataIsArray = Array.isArray(data)

  if (typeof keys === 'boolean') {
    autoSearch = keys
    keys = []
  }

  if (dataIsArray) {
    data.forEach((item) => {
      if (autoSearch) {
        return fillObjectI18n(item)
      }
      keys.forEach((key) => {
        if (!item[key]) {
          return
        }
        item[key] = item[key][lang]
      })
    })
  } else {
    if (autoSearch) {
      return fillObjectI18n(data)
    }
    keys.forEach((key) => {
      if (!data[key]) {
        return
      }
      data[key] = data[key][lang]
    })
  }

  return data
}

/**
 * 根据参数生成 render 数据
 * @param params 资源或动作参数
 * @return {{form: Array, rules}}
 */
export function renderParamsForm(params = {}, propPrefix = '') {
  const form = []
  const rules = {}

  for (const [k, v] of Object.entries(params)) {
    if (k === '$resource') {
      continue
    }
    const {
      default: defaultValue, description,
      enum: enumValue, title, type,
      input = 'text', order = 10, format, required = false,
    } = v
    let inputType = type
    let elType = 'input'
    let field = {}
    switch (type) {
      case 'string':
        inputType = input || 'text'
        break
      case 'number':
        inputType = 'number'
        break
      case 'boolean':
        inputType = 'text'
        elType = 'select'
        field = { list: [true, false] }
        break
    }
    if (enumValue) {
      elType = 'select'
      field = { list: enumValue }
    }
    const inputPlaceholder = description.length < 24 ? description : ''

    // 表单类型, 渲染使用的属性
    form.push({
      formItemAttributes: {
        prop: propPrefix ? `${propPrefix}.${k}` : k,
        label: title,
        description: inputPlaceholder ? null : description.replace(/\n/g, '<br/>'),
      },
      bindAttributes: {
        type: inputType,
        field: elType === 'select' ? field : undefined,
        placeholder: inputPlaceholder,
        rows: inputType === 'textarea' ? 5 : 0,
      },
      key: k,
      type: inputType,
      elType,
      value: defaultValue,
    })

    // rules 的属性
    rules[k] = []
    if (required) {
      rules[k].push({ required: true, message: elType === 'input' ? '请输入' : '请选择' })
    }
    if (enumValue) {
      rules[k].push({ type: 'enum', enum: enumValue })
    }
  }
  // form 综合排序
  return { form, rules }
}
