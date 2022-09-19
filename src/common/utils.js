/* eslint-disable */
import Clipboard from 'clipboard'
import sqlFormatter from 'sql-formatter'
import parser from 'js-sql-parser'
import { Message } from 'element-ui'

import store from '@/stores'
import router from '@/routes'
import lang from '@/i18n'
import { omit, cloneDeep, isObject } from 'lodash'

import { enDocsLink, zhDocsLink, pluginsZh, pluginsEn } from '@/common/link_urls'

const locale = store.state.lang
const VueI18n = lang[locale]

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
  if (!(router.currentRoute && router.currentRoute.name === 'login')) {
    router.push({ path: '/login', query: { to: router.fullPath } })
    return true
  }
  return false
}

/**
 * 将函数包装为异步函数
 * @param Promise
 * @return Promise
 */
export const awaitWrap = (promise) => promise.then((data) => data).catch((err) => null)

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

  Object.keys(data).forEach((key) => {
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

function isDescTooShort(desc) {
  const lengthLimit = store.state.lang === 'zh' ? 10 : 16
  return desc.length < lengthLimit
}

/**
 * 根据参数生成 render 数据
 * @param params 资源或动作参数
 * @return {{form: Array, rules}}
 */
export function renderParamsForm(params = {}, propPrefix = '') {
  let form = []
  const rules = {}
  let oneObjOfArray = {}
  let extraConfigs = {}

  for (const [k, v] of Object.entries(params)) {
    if (k === '$resource') {
      continue
    }
    const {
      default: defaultValue,
      description = '',
      enum: enumValue,
      title,
      type,
      input = 'text',
      order = 10,
      format,
      required = false,
      items,
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
        defaultValue =
          defaultValue && typeof defaultValue === 'object' && Object.keys(defaultValue).length ? defaultValue : {}
        elType = 'object'
        break
      case 'file':
        defaultValue =
          typeof defaultValue === 'string'
            ? {
                file: '',
                filename: defaultValue,
              }
            : defaultValue
        elType = 'file'
        break
      case 'binary_file':
        defaultValue =
          typeof defaultValue === 'string'
            ? {
                file: '',
                filename: defaultValue,
              }
            : defaultValue
        elType = 'binary_file'
        break
      case 'array':
        if (items.type === 'object') {
          const { schema } = items
          oneObjOfArray = renderParamsForm(schema)
          defaultValue = !defaultValue.length ? [] : defaultValue
        }
        elType = 'array'
        break
      case 'cfgselect':
        elType = 'cfgselect'
        field = { list: enumValue }
        extraConfigs = items
    }
    if (enumValue && elType !== 'cfgselect') {
      elType = 'select'
      field = { list: enumValue }
    }
    const inputPlaceholder = isDescTooShort(description) && propPrefix !== 'configs' ? description : ''
    // 表单类型, 渲染使用的属性
    const isEditableSelect = input === 'editable_select'
    form.push({
      formItemAttributes: {
        prop: propPrefix ? `${propPrefix}.${k}` : k,
        label: title,
        description:
          description === title || (inputPlaceholder && elType !== 'file' && propPrefix !== 'configs')
            ? null
            : description.replace(/\n/g, '<br/>'),
      },
      bindAttributes: {
        type: inputType,
        field: elType === 'select' || elType === 'cfgselect' ? field : undefined,
        placeholder: inputPlaceholder,
        rows: inputType === 'textarea' ? 5 : 0,
        filterable: isEditableSelect,
        'allow-create': isEditableSelect,
      },
      key: k,
      type: inputType,
      elType,
      value: !defaultValue && propPrefix === 'configs' ? '' : defaultValue,
      order,
      oneObjOfArray: elType === 'array' ? oneObjOfArray : {},
      extraConfigs: elType === 'cfgselect' ? extraConfigs : {},
    })
    // rules 的属性
    rules[k] = []
    const requiredInputText = locale === 'zh' ? '请输入' : 'Field required'
    const requiredSelectText = locale === 'zh' ? '请选择' : 'Please select'
    const requiredArrayText = locale === 'zh' ? '请添加' : 'Please Add'

    if (required) {
      if (elType === 'array') {
        rules[k].push({ required: true, message: requiredArrayText })
      } else {
        rules[k].push({ required: true, message: elType === 'input' ? requiredInputText : requiredSelectText })
      }
    }
    if (enumValue && !isEditableSelect) {
      const options = enumValue.map(($) => (typeof $ === 'boolean' ? $.toString() : $))
      rules[k].push({ type: 'enum', enum: options })
    }
  }
  form = form.sort((prev, next) => prev.order - next.order)
  // form 综合排序
  return { form, rules }
}

export function setAFieldRequired(rule, required = true) {
  if (Array.isArray(rule)) {
    return rule.map((ruleItem) => ({ ...ruleItem, required }))
  }
  return { ...rule, required }
}

export function booleanFieldValueToBoolean(val) {
  return typeof val === 'boolean' ? val : val === 'true'
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
 * 根据语言获取插件教程的跳转链接
 * @param name
 * @return link: string
 */
export function getPluginsLink(name) {
  const { lang = 'zh' } = store.state
  const dictMap = lang === 'zh' ? pluginsZh : pluginsEn
  return dictMap[name] || ''
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
      const newParamsText = paramsText
        .replace(/(!#!|\s)/g, ' ')
        .split(/[,，]/)
        .join(', ')
      text = text.replace(paramsText, `${newParamsText}`)
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

/**
 * 取 URL 具体的一个参数值
 * @param url 查询的 url, key 参数的名称
 * @return value string
 */
export const getParamValue = (url, key) => {
  const regex = new RegExp(`${key}=([^&]*)`, 'i')
  const value = url.match(regex)[1]
  return decodeURIComponent(value)
}

/**
 * 模糊查询搜索
 * @param data 搜索的数据 searchKey 搜索的字段名称 searchValue 搜索的值
 * @return value Promise<any>
 */
export const matchSearch = (data, searchKey, searchValue) => {
  return new Promise((resolve, reject) => {
    try {
      const filterData = data.filter(($) => {
        if ($[searchKey]) {
          const key = $[searchKey].toLowerCase().replace(/\s+/g, '')
          const value = searchValue.toLocaleLowerCase().replace(/\s+/g, '')
          return key.match(value)
        } else {
          return null
        }
      })
      return resolve(filterData)
    } catch (error) {
      return reject(error)
    }
  })
}

/**
 * 将内存数值转化为 KB MB G
 * @param number 需要转化的数值
 * @return string 转化后的字符串
 */
export const formatNumberSize = (number) => {
  const scale = 1000
  const digitList = ['K', 'M', 'G', 'T']
  let residue = Math.round((number % scale) / 100) // 小数点后数，1位
  let $integer = Math.round(number / scale) // 最小单位kb
  let digit = 0
  while ($integer > scale) {
    residue = Math.round(($integer % scale) / 100)
    $integer = Math.round($integer / scale)
    digit += 1
  }
  return `${$integer}.${residue}${digitList[digit]}B`
}

export const formatNumber = (num) => {
  if (num > 10000) {
    const value = num / 1000
    return `${parseInt(value * 100, 10) / 100}K`
  }
  return num
}

export function ruleOldSqlCheck(sql) {
  const $sql = sql.replace(/\"/g, '')
  const oldEvent = [
    'message.publish',
    'message.deliver',
    'message.acked',
    'message.dropped',
    'client.connected',
    'client.disconnected',
    'client.subscribe',
    'client.unsubscribe',
  ]
  let matchRes = null
  oldEvent.forEach((e) => {
    const [eventType, eventValue] = e.split('.')
    const eventReg = new RegExp(`${eventType}\\.${eventValue}`, 'gim')
    if ($sql.match(eventReg)) {
      matchRes = $sql.match(eventReg)
    }
  })
  return matchRes
}

export function ruleNewSqlParser(sql, e) {
  const oldEventDict = {
    'message.publish': '',
    'message.deliver': '$events/message_delivered',
    'message.acked': '$events/message_acked',
    'message.dropped': '$events/message_dropped',
    'client.connected': '$events/client_connected',
    'client.disconnected': '$events/client_disconnected',
    'client.subscribe': '$events/session_subscribed',
    'client.unsubscribe': '$events/session_unsubscribed',
  }
  let newEvent = oldEventDict[e]
  const $sql = sql.replace(/\"/g, '')
  try {
    const ast = parser.parse($sql)
    if (newEvent === '') {
      ast.value.where = null
      newEvent = '#'
    }
    ast.value.from.value[0].value.value.value = `"${newEvent}"`
    return parser.stringify(ast)
  } catch (err) {
    Message.error(err.toString())
  }
}

/**
 * @param duration (ms)
 * @return dd:hh:mm:ss
 */
export function getDateDiff(duration) {
  // get total seconds value (s)
  const dateDiff = Math.floor(duration / 1000)
  const days = Math.floor(dateDiff / (3600 * 24))

  const daysRemainder = dateDiff % (3600 * 24)
  const hours = Math.floor(daysRemainder / 3600)

  const minutes = Math.floor((dateDiff % 3600) / 60)
  const seconds = dateDiff % 60

  return [days, hours, minutes, seconds]
    .map((n) => {
      return n >= 10 ? n : `0${n}`
    })
    .join(':')
}

export const verifyID = (rule, value, callback) => {
  const reg = /^[0-9a-zA-Z_:]{1,64}$/
  if (!value) {
    callback(new Error(VueI18n.RuleEngine.pleaseEnter))
  } else if (value.length > 64) {
    callback(new Error(VueI18n.RuleEngine.id_len_tip))
  } else if (!reg.test(value)) {
    callback(new Error(VueI18n.RuleEngine.id_char_tip))
  } else {
    callback()
  }
}

export const verifyListener = (rule, value, callback) => {
  if (!value) {
    callback(new Error(VueI18n.RuleEngine.pleaseEnter))
  } else {
    const port = value.includes(':') ? value.split(':')[1] : value
    const portIntVal = parseInt(port, 10)
    if (portIntVal > 65535 || portIntVal <= 0) {
      callback(new Error(VueI18n.Settings.portRangeTip))
    } else {
      callback()
    }
  }
}

export const checkNOmitFromObj = (obj) => {
  const ret = cloneDeep(obj)
  const emptyValueKeyArr = Object.keys(ret).filter((key) => {
    if (isObject(ret[key]) && !Array.isArray(ret[key])) {
      ret[key] = checkNOmitFromObj(ret[key])
    }
    return typeof ret[key] === 'string' ? !ret[key] : false
  })
  return omit(ret, emptyValueKeyArr)
}

export const readFile = async (file, fileType) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (fileType === 'text') {
      reader.readAsText(file, 'UTF-8')
    } else {
      reader.readAsArrayBuffer(file)
    }
    reader.onload = function (evt) {
      const content = evt.target.result
      if (content) {
        resolve(content)
      } else if (content === '') {
        // TODO:t
        Message.error(t('common.readFileError'))
        reject()
      } else if (content === undefined) {
        // TODO:t
        Message.error(t('common.readFileError'))
        reject()
      }
    }
    reader.onerror = function (evt) {
      // TODO:t
      Message.error(t('common.readFileError'))
      reject()
    }
  })
}

export const hidePwd = (pwd) => {
  if (!pwd || typeof pwd !== 'string') {
    return pwd
  }
  return pwd.replace(/./g, '*')
}

export const downloadBlobData = (blobRes) => {
  const { data, headers } = blobRes
  if (!(data instanceof Blob)) {
    return
  }
  const fileName =
    (headers && headers['content-disposition'] && headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')) ||
    'file'
  const blob = new Blob([data], { type: headers['content-type'] })
  const DOM = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  DOM.href = url
  DOM.download = decodeURI(fileName)
  DOM.style.display = 'none'
  document.body.appendChild(DOM)
  DOM.click()
  if (DOM.parentNode) {
    DOM.parentNode.removeChild(DOM)
  }
  window.URL.revokeObjectURL(url)
}

export default {}
