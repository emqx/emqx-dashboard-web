import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'

import Alerts from './Alerts'
import Base from './Base'
import components from './components'
import Connections from './Connections'
import Func from './Function'
import Overview from './Overview'
import Plugins from './Plugins'
import RuleEngine from './RuleEngine'
import Tools from './Tools'

const lang = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
}

const model = ['Alerts', 'Base', 'components', 'Connections', 'Function', 'Overview', 'Plugins', 'RuleEngine', 'Tools']
model.forEach((key) => {
  const value = require(`./${key}`).default

  Object.keys(value).forEach((k) => {
    const { en, zh } = value[k]
    lang.en[key] = lang.en[key] || {}
    lang.zh[key] = lang.zh[key] || {}

    lang.en[key][k] = en
    lang.zh[key][k] = zh
  })
})

export default lang
