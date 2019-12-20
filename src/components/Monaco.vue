<template>
  <div :id="`monaco-${id}`" class="minaco-view"></div>
</template>


<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

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
  },

  data() {
    return {
      editor: null,
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
      this.editor.dispose()
    }
  },

  methods: {
    initEditor() {
      // Create
      const id = `monaco-${this.id}`
      this.editor = monaco.editor.create(document.getElementById(id), {
        value: this.value,
        language: this.lang,
        fontSize: 14,
        automaticLayout: true,
        readOnly: this.disabled,
        lineNumbersMinChars: 2,
        theme: 'vs',
        minimap: {
          enabled: false,
        },
      })
      // event changed
      this.editor.onDidChangeModelContent((event) => {
        const value = this.editor.getValue()
        if (value !== this.value) {
          this.$emit('input', value, event)
          this.$emit('change', value, event)
        }
      })
      // Qucik save method
      // eslint-disable-next-line
      this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
        this.$emit('qucik-save', this.value)
      })
    },
  },
}
</script>


<style lang="scss">
.minaco-view {
  height: 100%;
  position: relative;
}
</style>
