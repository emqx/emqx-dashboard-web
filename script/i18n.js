const fs = require('fs')
const path = require('path')
const glob = require('glob')
const axios = require('axios')
const crypto = require('crypto')

const ENTRY = path.join(__dirname, '../src')

const db = {
  all: {},
}

/**
 * 中文转英文
 * @param q 翻译的 key
 * @returns {Promise<*>}
 */
async function translate(q) {
  const salt = Math.random().toString(16).slice()
  const appid = '20180806000191960'
  const key = '9oYZ4Cm0E9qxwEbcdpNv'
  const string = `${appid}${q}${salt}${key}`
  const sign = crypto.createHash('md5').update(string).digest('hex')
  const resp = await axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
    params: {
      q,
      from: 'zh',
      to: 'en',
      appid,
      salt,
      sign,
    },
  })
  if (!resp.data.trans_result) {
    console.log(resp.data)
  }
  const res = resp.data.trans_result[0]
  if (!res) {
    return q
  }
  return res.dst
}

async function loadFileModel() {
  const viewPath = path.join(ENTRY, './views')
  const files = await glob.sync(`${viewPath}/**/**.vue`)

  const views = files.map((file) => {
    // 取 views/:model/**/**.vue
    const re = file.match(new RegExp(`${viewPath}/(.+)?/`))
    const model = re ? re[1].replace('/components', '') : 'common'
    const name = file.split('/').pop()
    return { name, model, file }
  })

  const compsPath = path.join(ENTRY, './components')
  const comps = await glob.sync(`${compsPath}/**/**.vue`)
  const compss = comps.map((file) => {
    const name = file.split('/').pop()
    return { name, model: 'components', file }
  })

  return [...views, ...compss]
}

function getWords(str) {
  return str.match(/[\u4e00-\u9fa5\d,，？]+/gim) || []
}

async function getModelWord(fileModel = {}) {
  const { name, model, file } = fileModel
  const rows = fs.readFileSync(file).toString()
  const dictMap = {}
  const words = getWords(rows)

  // 存储进去
  db[model] = db[model] || {}
  words.forEach((word) => {
    if (/^[0-9,]*$/.test(word)) {
      return
    }
    db[model][word] = word
    db.all[word] = word
  })
  return words
}

const utils = {
  sleep(timer = 200) {
    return new Promise(resolve => setTimeout(resolve, timer))
  },
  // 单词转驼峰 key
  trans2Key(word) {
    const re = /[-\b\s_](\w)/g
    let key = word.replace(re, ($0, $1) => $1.toUpperCase()).split('')
    key[0] = key[0].toLowerCase()
    return key.join('')
  },
}

async function process() {
  const models = await loadFileModel()
  db.models = models
  models.forEach(async (model) => {
    await getModelWord(model)
  })

  // trans db.all
  for (const key of Object.keys(db.all)) {
    const value = db.all[key]
    const transValue = await translate(value)
    db.all[key] = {
      key: utils.trans2Key(transValue),
      zh: key,
      en: transValue,
    }
    await utils.sleep(1100)
    console.log(`trans success: ${key} -> ${transValue}`)
  }
  const dictPath = path.join(__dirname, './dict.json')
  fs.writeFileSync(dictPath, JSON.stringify(db))
}

async function processFile() {
  const models = await loadFileModel()
  const dictMap = require('./dict')

  models.forEach((item) => {
    const { name, model, file } = item

  })
}

process()

