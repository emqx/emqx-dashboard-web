import { Drawer, Card } from 'ant-design-vue'
import 'ant-design-vue/lib/drawer/style';
import 'ant-design-vue/lib/card/style';

export default (Vue) => {
  Vue.component(Drawer.name, Drawer)
  Vue.component(Card.name, Card)
}
