import { Drawer, Card, Badge, Skeleton } from 'ant-design-vue'
import 'ant-design-vue/lib/drawer/style'
import 'ant-design-vue/lib/card/style'
import 'ant-design-vue/lib/badge/style'
import 'ant-design-vue/lib/skeleton/style'

import EmqSelect from '@/components/EmqSelect'

export default (Vue) => {
  Vue.component(Drawer.name, Drawer)
  Vue.component(Card.name, Card)
  Vue.component(Badge.name, Badge)
  Vue.component(Skeleton.name, Skeleton)

  Vue.component(EmqSelect.name, EmqSelect)
}
