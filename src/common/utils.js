/* eslint-disable */
import Clipboard from 'clipboard'
import sqlFormatter from 'sql-formatter'

import store from '@/stores'
import router from '@/routes'

const { lang = 'zh' } = store.state

import { en as enDocsLink, zh as zhDocsLink } from '@/common/link_urls'

/**
 * 获取基础的验证信息
 * @param null
 * @return User: object
 */
export function getBasicAuthInfo() {
  return store.state.user
}

/**
 * 跳转到登录页面
 * @param null
 * @return null
 */
export function toLogin() {
  store.dispatch('UPDATE_USER_INFO', { logOut: true })
  router.push({ path: '/login', query: { to: router.fullPath } })
}

/**
 * 将函数包装为异步函数
 * @param Promise
 * @return Promise
 */
export const awaitWrap = promise => promise
  .then(data => data)
  .catch(err => null)

/**
 * 安全的转化 JSON 字符串
 * @param jsonStr: 被转化的 JSON 字符串，defaultValue: 失败时返回的默认值
 * @return Object
 */
export function safeParser(jsonStr, defaultValue = {}) {
  try {
    return JSON.parse(jsonStr) || defaultValue
  } catch (e) {
    return defaultValue
  }
}

/**
 * 填充转化对象类型的 i18n
 * @param data 转化的数据，key 对象的 key 值，autoSearch 是否自动搜索
 * @return data: object
 */
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
      default: defaultValue, description = '',
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
      case 'object':
        elType = 'object'
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
    const requiredInputText = lang === 'zh' ? '请输入' : 'Field required'
    const requiredSelectText = lang === 'zh' ? '请选择' : 'Please select'

    if (required) {
      rules[k].push({ required: true, message: elType === 'input' ? requiredInputText : requiredSelectText })
    }
    if (enumValue) {
      rules[k].push({ type: 'enum', enum: enumValue })
    }
  }
  // form 综合排序
  return { form, rules }
}

/**
 * 根据语言获取跳转的链接
 * @param name
 * @return link: string
 */
export function getLink(name) {
  const { lang = 'zh' } = store.state
  const dictMap = lang === 'zh' ? zhDocsLink : enDocsLink
  return dictMap[name] || '/'
}

/**
 * 复制到剪切板
 * @param el 复制指令绑定的元素，binding 剪切板配置，包括值value，成功失败时的回调函数
 * @return el: DOM
 */
export const cpoyToClipboard = (el, binding) => {
  const clipboard = new Clipboard(el, {
    text() {
      return binding.value
    },
    acttion() {
      return 'copy'
    },
  })
  clipboard.on('success', (e) => {
    const callback = el._v_clipboard_success
    callback && callback(e)
  })
  clipboard.on('error', (e) => {
    const callback = el._v_clipboard_error
    callback && callback(e)
  })
  el._v_clipboard = clipboard
  return el
}

/**
 * sql 语句格式化
 * @param sql 传入的 sql 语句
 * @return sql: string
 */
export const sqlExampleFormatter = (sql) => {
  const newSQL = sqlFormatter.format(sql)
  let text = newSQL.replace(/= ~/g, '=~').replace(/\n/g, '!#!')
  const paramsRe = text.match(/SELECT!#!(.+)!#!FROM/)
  if (paramsRe) {
    const paramsText = paramsRe[1]
    if (paramsText) {
      const newParamsText = paramsText.replace(/(!#!|\s)/g, ' ').split(/[,，]/).join(', ')
      text = text.replace(paramsText, `  ${newParamsText}`)
    }
  }
  return text.replace(/!#!/g, '\n\r')
}

/**
 * 是否隐藏页面元素
 * @param scope 查询的隐藏属性
 * @return boolean
 */
export const hasShow = (scope = '') => {
  const hide = store.state.config.hide || { routes: [], children: [] }
  if (!scope) {
    return true
  }
  return !(hide.routes.includes(scope) || hide.children.includes(scope))
}
