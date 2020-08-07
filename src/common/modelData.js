import lang from '@/i18n'
import store from '@/stores'

const local = store.state.lang
const VueI18n = lang[local]

const dataTypeList = [
  { label: 'integer', value: VueI18n.Models.integer },
  { label: 'fixString', value: VueI18n.Models.fixString },
  { label: 'fixBinary', value: VueI18n.Models.fixBinary },
  { label: 'unsignInt', value: VueI18n.Models.unsignInt },
  { label: 'unfixString', value: VueI18n.Models.unfixString },
  { label: 'unfixBinary', value: VueI18n.Models.unfixBinary },
  { label: 'timeStamp', value: VueI18n.Models.timeStamp },
  { label: 'float', value: VueI18n.Models.float },
  { label: 'double', value: VueI18n.Models.double },
]

const jsonDataTypeList = [
  { label: 'integer', value: VueI18n.Models.integer },
  { label: 'fixString', value: VueI18n.Models.fixString },
  { label: 'unsignInt', value: VueI18n.Models.unsignInt },
  { label: 'unfixString', value: VueI18n.Models.unfixString },
  { label: 'timeStamp', value: VueI18n.Models.timeStamp },
  { label: 'float', value: VueI18n.Models.float },
  { label: 'double', value: VueI18n.Models.double },
  { label: 'array', value: VueI18n.Models.array },
]

const dataTypeDic = {
  integer: VueI18n.Models.integer,
  fixString: VueI18n.Models.fixString,
  fixBinary: VueI18n.Models.fixBinary,
  unsignInt: VueI18n.Models.unsignInt,
  unfixString: VueI18n.Models.unfixString,
  unfixBinary: VueI18n.Models.unfixBinary,
  timeStamp: VueI18n.Models.timeStamp,
  float: VueI18n.Models.float,
  double: VueI18n.Models.double,
}

const lengthList = {
  integer: [
    { label: VueI18n.Models.oneByte, value: 1 },
    { label: VueI18n.Models.twoBytes, value: 2 },
    { label: VueI18n.Models.fourBytes, value: 4 },
  ],
  unsignInt: [
    { label: VueI18n.Models.oneByte, value: 1 },
    { label: VueI18n.Models.twoBytes, value: 2 },
    { label: VueI18n.Models.fourBytes, value: 4 },
    { label: VueI18n.Models.eightBytes, value: 8 },
  ],
  float: [
    { label: VueI18n.Models.fourBytes, value: 4 },
  ],
  double: [
    { label: VueI18n.Models.eightBytes, value: 8 },
  ],
  timeStamp: [
    { label: VueI18n.Models.eightBytes, value: 8 },
  ],
}


export {
  dataTypeList,
  jsonDataTypeList,
  dataTypeDic,
  lengthList,
}
