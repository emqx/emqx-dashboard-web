export default {
  install(vue) {
    vue.mixin({
      computed: {
        notAbleChange() {
          const { role } = (this.$store && this.$store.state && this.$store.state.user) || {}
          return role === 'viewer'
        },
      },
    })
  },
}
