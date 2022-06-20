<template>
  <div :id="`monaco-${id}`" class="monaco-view"></div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const CLASS_PREFIX = 'custom-'
const highlightLogTypeArr = [
  { type: 'debug', color: '1d4fa4' },
  { type: 'info', color: '3b8659' },
  { type: 'notice', color: 'FFA500' },
  { type: 'warning', color: 'dda450' },
  { type: 'error', color: 'ff0000', fontStyle: 'bold' },
  { type: 'critical', color: 'dda450' },
  { type: 'alert', color: 'dda450' },
  { type: 'emergency', color: 'dda450' },
]

const addressRegExp =
  /((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])(:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|([1-5]\d{0,4}|\d{0,4})))?)/
const timeStampRegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(\+\d{2}:\d{2})?/
const highlightLogTargetArr = [
  { type: 'address', reg: addressRegExp, color: '1024f5' },
  { type: 'time', reg: timeStampRegExp, color: '63bf8c' },
]

export default {
  name: 'Monaco',

  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    warp: {
      type: Boolean,
      default: false,
    },
    scrollLoading: {
      type: Boolean,
      default: false,
    },
    scrollFunc: {
      type: Function,
      default: () => () => {},
    },
  },

  data() {
    return {
      editor: null,
      providerDisposeID: null,
      hoverDisposeID: null,
    }
  },

  watch: {
    value(val) {
      if (this.editor) {
        if (val !== this.editor.getValue()) {
          this.editor.setValue(val)
        }
      }
    },
    lang() {
      if (this.editor) {
        this.editor.dispose()
        this.initEditor()
      }
    },
  },

  created() {
    window.onresize = () => {
      if (this.editor) {
        this.editor.layout()
      }
    }
  },

  mounted() {
    this.initEditor()
  },

  beforeDestroy() {
    if (this.editor) {
      this.editor.getModel().dispose()
      this.editor.dispose()
      this.editor = null
    }
    if (this.providerDisposeID) {
      this.providerDisposeID.dispose()
    }
    if (this.hoverDisposeID) {
      this.hoverDisposeID.dispose()
    }
  },

  methods: {
    initEditor() {
      this.setMonarchTokensProvider()
      this.defineTheme()
      const id = `monaco-${this.id}`
      const defaultOptions = {
        value: this.value,
        language: 'traceLog',
        readOnly: this.disabled,
        fontSize: 12,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        theme: 'logTheme',
        minimap: {
          enabled: false,
        },
        hover: {
          delay: 500,
          enabled: true,
        },
        wordWrap: 'on',
        wordWrapMinified: true,
        wrappingIndent: 'indent',
      }
      const options = this.beforeMonacoCreate(defaultOptions)
      // Create
      this.editor = monaco.editor.create(document.getElementById(id), options)
      // event changed
      this.editor.onDidChangeModelContent((event) => {
        const value = this.editor.getValue()
        if (value !== this.value) {
          this.$emit('input', value, event)
          this.$emit('change', value, event)
        }
      })
      // Update editor options
      this.editor.getModel().updateOptions({ tabSize: 2 })

      if (this.scrollLoading) this.editor.onDidScrollChange(this.scrollFunc)
    },
    beforeMonacoCreate(options) {
      if (this.warp) {
        const warpOptions = {
          wordWrap: 'on',
          wrappingIndent: 'indent',
        }
        Object.assign(options, warpOptions)
      }
      return options
    },
    setMonarchTokensProvider() {
      const baseRoot = highlightLogTypeArr.map(({ type }) => [new RegExp(`\\[${type}\\]`), `${CLASS_PREFIX}${type}`])
      const specialMsgRoot = highlightLogTargetArr.map(({ reg, type }) => [reg, `${CLASS_PREFIX}${type}`])

      // Register a new language
      monaco.languages.register({ id: 'traceLog' })
      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('traceLog', {
        tokenizer: {
          root: [...baseRoot, ...specialMsgRoot],
        },
      })
    },
    defineTheme() {
      const baseRules = highlightLogTypeArr.map(({ type, color: foreground, ...otherConfig }) => ({
        token: `${CLASS_PREFIX}${type}`,
        foreground,
        ...otherConfig,
      }))
      const specialMsgRules = highlightLogTargetArr.map(({ type, color: foreground }) => ({
        token: `${CLASS_PREFIX}${type}`,
        foreground,
      }))

      monaco.editor.defineTheme('logTheme', {
        base: 'vs',
        inherit: false,
        rules: [...baseRules, ...specialMsgRules],
        colors: {
          'editor.foreground': '#000000',
        },
      })
    },
  },
}
</script>

<style lang="scss">
.monaco-container {
  padding-bottom: 2px;
}
.monaco-view {
  height: 100%;
  position: relative;
}
</style>
