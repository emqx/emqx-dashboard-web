<template>
  <div class="">
    <el-tabs tab-position="left" @tab-click="clickTab">
      <template v-for="pane in panes">
        <el-tab-pane :label="tl(`${pane}`)" :key="pane" :lazy="true">
          <div class="sec-header-title">
            {{ tl(`${pane}`) }}
          </div>
          <component :is="pane" class="item-page" :translate="tl"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import Retainer from './components/retainer.vue'
import Rewrite from './components/rewrite.vue'
import Subscribe from './components/subscribe.vue'
import Postpone from './components/postpone.vue'
import Message from './components/message.vue'

export default defineComponent({
  components: {
    Rewrite,
    Retainer,
    Subscribe,
    Postpone,
    Message,
  },
  setup() {
    let panes = ref(['retainer', 'rewrite', 'subscribe', 'postpone', 'message'])

    const tl = function (key, collection = 'Advanced') {
      return this.$t(collection + '.' + key)
    }

    const clickTab = async function (tab) {
      tab.$children[0]?.reloading && tab.$children[0].reloading()
    }

    return {
      panes,
      tl,
      clickTab,
    }
  },
})
</script>
<style lang="scss" scoped>
$mid-menu-width: 160px;

.sec-header-title {
  font-size: 24px;
  font-weight: 700;
  padding-bottom: 20px;
}
.el-tabs--left ::v-deep {
  .el-tabs__header.is-left {
    position: fixed;
    background-color: #fff;
    z-index: 100;
    width: $mid-menu-width;
    margin-top: -9px;
  }
  .el-tabs__content {
    margin-left: $mid-menu-width;
    padding: 10px;
  }
}
.item-page ::v-deep {
  .el-tabs__content {
    margin-left: 0;
  }

  .section-header {
    > :first-child {
      font-size: 18px;
    }
  }

  .part-header {
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
