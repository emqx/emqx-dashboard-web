export default {
  data() {
    return {
      pageLoading: false,
      saveLoading: false,
      accessType: undefined,
      record: {},
    }
  },

  computed: {
    accessTitle() {
      const titelKey = this.accessType
      const titleOptions = {
        view: this.$t('Base.view'),
        create: this.$t('Base.create'),
        edit: this.$t('Base.edit'),
      }
      return titleOptions[titelKey]
    },
    disabled() {
      return this.$route.query.oper === 'view'
    },
    detailsID() {
      return this.$route.params.id
    },
  },

  methods: {
    viewDetails() {},
  },

  created() {
    this.accessType = this.$route.query.oper
    if (this.accessType === 'view') {
      this.viewDetails(this.detailsID)
    }
  },
}
