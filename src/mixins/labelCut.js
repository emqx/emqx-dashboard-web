export default {
  computed: {
    aRowMaxChars() {
      return Math.ceil(parseInt(this.labelWidth, 10) / 10)
    },
  },
  methods: {
    labelToShow(label) {
      if (label.length > this.aRowMaxChars) {
        for (let i = this.aRowMaxChars; i > 0; i -= 1) {
          if (label[i] === '_') {
            return `${label.slice(0, i + 1)}<br />${label.slice(i + 1)}`
          }
        }
      }
      return label
    },
  },
}
