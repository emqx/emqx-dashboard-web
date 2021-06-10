import EmqSelect from '@/components/EmqSelect'
import PageHeader from '@/components/PageHeader'
// import { hasShow } from '@/common/utils'

export default (Vue) => {
  Vue.component(EmqSelect.name, EmqSelect)
  Vue.component(PageHeader.name, PageHeader)

  // Vue.prototype.$hasShow = hasShow
}
