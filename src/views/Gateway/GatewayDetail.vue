<template>
  <div class="app-wrapper gateway-detail">
    <div class="section-header">
      <div>
        <span :class="['g-icon', `g-${gname}`]"></span>
        <span class="title-n-status">
          <span class="section-title">{{ gname }}</span>
          <el-tag type="info" class="section-status">
            <span><i class="g-status"></i></span>
          </el-tag>
        </span>
      </div>
      <div>
        <!-- <el-button type="danger" plain size="small">{{ $t('Base.delete') }}</el-button> -->
        <el-button size="small" type="danger" plain> {{ $t('Base.stop') }}</el-button>
      </div>
    </div>
    <el-menu router :default-active="matchedUrl" mode="horizontal">
      <template v-for="item in types">
        <el-menu-item :index="`${item}`" :key="item">{{ tl(item) }}</el-menu-item>
      </template>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'GatewayDetail',
  data: function () {
    return {
      types: ['basic', 'listeners', 'auth', 'clients'],
      gname: this.$route.params.name,
    }
  },
  computed: {
    matchedUrl: function () {
      let currentPath = this.$route.path || ''
      return (
        this.types.find((v) => {
          return currentPath.match(v)
        }) || this.types[0]
      )
    },
  },
  setup(p) {
    const tl = function (key, collection = 'Gateway') {
      return this.$t(collection + '.' + key)
    }

    return {
      tl,
    }
  },
})
</script>

<style lang="scss" scoped>
.g-icon::before {
  width: 60px;
  height: 60px;
  content: '';
  display: inline-block;
  background-size: contain;
}

.title-n-status {
  height: 45px;
}
// .section-header > span {
//   display: inline-block;
// }
.section-title {
  font-size: 14px;
  font-weight: 700;
  flex-grow: 1;
}
.section-status {
  height: 18px;
  border-radius: 6px;
}
.el-menu.el-menu--horizontal {
  margin-bottom: 40px;
}
</style>
