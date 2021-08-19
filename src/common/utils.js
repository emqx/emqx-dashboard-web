/* eslint-disable */
import Clipboard from 'clipboard'
import sqlFormatter from 'sql-formatter'
import parser from 'js-sql-parser'
import { Message } from 'element-ui'

import store from '@/stores'
import router from '@/routes'
// import lang from '@/i18n/index'
import i18n from '@/i18n'

// const locale = store.state.lang
// const VueI18n = lang[locale]

export function getBasicAuthInfo() {
  return store.state.user
}

//Logout and go to Login page
export async function toLogin(path) {
  await store.dispatch('UPDATE_USER_INFO', { logOut: true })
  store.commit('UPDATE_EDITION', null)
  store.commit('SET_LANGUAGE', null)
  router.currentRoute?.path !== '/login' && router.push({ path: '/login', query: { to: path ? path : undefined } })
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
        defaultValue = !Object.keys(defaultValue).length ? {} : defaultValue
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
    const inputPlaceholder = description.length < 24 && propPrefix !== 'configs' ? description : ''
    // 表单类型, 渲染使用的属性
    form.push({
      formItemAttributes: {
        prop: propPrefix ? `${propPrefix}.${k}` : k,
        label: title,
        description:
          inputPlaceholder && elType !== 'file' && propPrefix !== 'configs'
            ? null
            : description.replace(/\n/g, '<br/>'),
      },
      bindAttributes: {
        type: inputType,
        field: elType === 'select' || elType === 'cfgselect' ? field : undefined,
        placeholder: inputPlaceholder,
        rows: inputType === 'textarea' ? 5 : 0,
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
    const requiredInputText =  'Field required'
    const requiredSelectText =  'Please select'
    const requiredArrayText =  'Please Add'

    if (required) {
      if (elType === 'array') {
        rules[k].push({ required: true, message: requiredArrayText })
      } else {
        rules[k].push({
          required: true,
          message: elType === 'input' ? requiredInputText : requiredSelectText,
        })
      }
    }
    if (enumValue) {
      const options = enumValue.map(($) => (typeof $ === 'boolean' ? $.toString() : $))
      rules[k].push({ type: 'enum', enum: options })
    }
  }
  form = form.sort((prev, next) => prev.order - next.order)
  // form 综合排序
  return { form, rules }
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
// export const formatNumberSize = (number) => {
//   const scale = 1000
//   const digitList = ['K', 'M', 'G', 'T']
//   let residue = Math.round((number % scale) / 100) // 小数点后数，1位
//   let $integer = Math.round(number / scale) // 最小单位kb
//   let digit = 0
//   while ($integer > scale) {
//     residue = Math.round(($integer % scale) / 100)
//     $integer = Math.round($integer / scale)
//     digit += 1
//   }
//   return `${$integer}.${residue}${digitList[digit]}B`
// }

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

export function formatNumber(num) {
  let number = String(parseInt(num))
  return number.replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,')
}

export function getProgressColor(val, primaryC) {
  let color = primaryC
  let num = parseInt(val)
  if (num >= 100) {
    color = '#E34242FF'
  } else if (num >= 85 && num < 100) {
    color = '#FB9237FF'
  }
  return color
}

export const calcPercentage = (n1, n2) => {
  let p = (parseInt(n1) / parseInt(n2)) * 100
  if (p && p < 1) return 1
  if (!p) return 0
  return p
}

export function getDateDiff(duration) {
  // get total seconds value (s)
  const dateDiff = Math.floor(duration)
  const days = Math.floor(dateDiff / (3600 * 24))

  const daysRemainder = dateDiff % (3600 * 24)
  const hours = Math.floor(daysRemainder / 3600)

  const minutes = Math.floor((dateDiff % 3600) / 60)
  const seconds = dateDiff % 60

  return [days, hours, minutes, seconds]
}

export function getDuration(duration) {
  let dateDiff = getDateDiff(duration / 1000 || [])
  let readableDate = []
  dateDiff.reduce((c, v, i) => {
    if (c == 0 && v == 0 && i < 3) {
    } else {
      switch (i) {
        case 0:
          readableDate.push([v, i18n.tc('General.day', v)])
          break
        case 1:
          readableDate.push([v, i18n.tc('General.hour', v)])
          break
        case 2:
          readableDate.push([v, i18n.tc('General.min', v)])
          break
        case 3:
          readableDate.push([v, i18n.tc('General.sec', v)])
          break
      }
    }
    return c + v
  }, 0)

  return readableDate
    .map((_) => {
      return _.join(i18n.t('General.timeSep'))
    })
    .join(i18n.t('General.timePartSep'))
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
export default {}
