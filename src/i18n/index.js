import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
import jaLocale from 'element-ui/lib/locale/lang/ja'

const lang = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
  ja: {
    ...jaLocale,
  },
}

const model = [
  'Alerts',
  'Base',
  'components',
  'Clients',
  'Topics',
  'General',
  'Overview',
  'Plugins',
  'RuleEngine',
  'Tools',
  'Schemas',
  'Settings',
  'Backup',
  'Subs',
  'Analysis',
  'Modules',
]
model.forEach((key) => {
  // eslint-disable-next-line
  const value = require(`./${key}`).default

  Object.keys(value).forEach((k) => {
    const { en, zh, ja } = value[k]
    lang.en[key] = lang.en[key] || {}
    lang.zh[key] = lang.zh[key] || {}
    lang.ja[key] = lang.ja[key] || {}

    lang.en[key][k] = en
    lang.zh[key][k] = zh
    lang.ja[key][k] = ja
  })
})

export default lang
