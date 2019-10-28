<template>
  <div class="code-editor">
    <textarea ref="textarea"></textarea>
  </div>
</template>


<script>
/* eslint-disable */
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/sql/sql'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'code-editor',

  props: {
    value: {
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    lineNumbers: {
      type: Boolean,
      default: true,
    },
    lint: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      codeEditor: false
    }
  },

  watch: {
    value(value) {
      const editorValue = this.codeEditor.getValue()
      if (value !== editorValue) {
        this.codeEditor.setValue(this.value)
      }
    },
    disabled() {
      this.codeEditor.setOption('readOnly', this.disabled)
    },
  },

  methods: {
    initEditorption() {
      this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: this.lineNumbers,
        lineWrapping: true,
        mode: this.lang,
        gutters: ['CodeMirror-lint-markers'],
        theme: this.theme || 'default',
        lint: this.lint,
        readOnly: this.disabled,
      })
      this.codeEditor.setValue(this.value)
      this.codeEditor.on('change', cm => {
        this.$emit('changed', cm.getValue())
        this.$emit('input', cm.getValue())
      })
    },

    getValue() {
      return this.codeEditor.getValue()
    },
  },

  mounted() {
    this.initEditorption()
  },
}
</script>


<style scoped>
.code-editor {
  height: 100%;
  position: relative;
}
.code-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
