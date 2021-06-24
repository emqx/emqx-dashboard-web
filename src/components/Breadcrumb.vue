<template>
  <div class="breadcrumb">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="(path, i) in pathList" :key="path">
        <router-link
          v-if="i !== pathList.length - 1"
          :to="calcPath(i)"
          tag="span"
          class="btn btn-default raw"
        >
          {{ getTitle(path) }}
        </router-link>
        <span v-else class="btn btn-default non-route">
          {{ getTitle(path) }}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',

  data() {
    return {
      oper: '',
      pathList: [],
    }
  },

  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },

  created() {
    this.getBreadcrumb()
  },

  methods: {
    calcPath(deep) {
      let pathLevel = deep + 1
      let path = this.pathList.slice(0, pathLevel).join('/')
      return path ? '/' + path : '/'
    },
    getBreadcrumb() {
      const { path} = this.$route
      this.pathList = path.split('/').slice(1)
    },
    getAlernateKeyFromBase(oper) {
      return ['create', 'view', 'detail', 'add', 'select', 'manage', 'edit'].includes(oper)
    },
    getTitle(key) {
      return this.getAlernateKeyFromBase(key)
        ? this.$t(`Base.${key}`)
        : this.$t(`components.${key}`)
    },
  },
}
</script>

<style lang="scss">
.breadcrumb {
  width: 100%;

  .non-route {
    cursor: default;
    color: #9d9d9d;
  }
}
</style>
