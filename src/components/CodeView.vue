<template>
  <pre ref="codeView" class="code-view">
    <code :class="lang">{{ code }}</code>
  </pre>
</template>


<script>
import hljs from 'highlight.js/lib/highlight'
import 'highlight.js/styles/solarized-dark.css'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)

export default {
  name: 'CodeView',

  components: {},

  props: {
    code: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: 'json',
    },
  },

  data() {
    return {}
  },

  watch: {
    code() {
      this.render()
    },
    lang() {
      this.render()
    },
  },

  mounted() {
    this.render()
  },

  methods: {
    render() {
      hljs.highlightBlock(this.$refs.codeView)
    },
  },
}
</script>
