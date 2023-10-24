<template>
  <el-input-number
    v-model="num"
    class="custom-input-number"
    :class="{ 'is-focus': isFocus }"
    v-bind="$attrs"
    controls-position="right"
    @focus="handleFocus"
    @blur="handleBlur"
    @keypress="handleKeypress"
  />
</template>

<script>
export default {
  name: 'CustomNumberInput',

  props: {
    value: {
      required: true,
    },
  },
  computed: {
    num: {
      get() {
        const { value } = this
        if (typeof value === 'string') {
          return !Number.isNaN(Number(value)) ? Number(value) : undefined
        }
        return value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },

  data() {
    return {
      isFocus: false,
    }
  },

  methods: {
    handleFocus() {
      this.isFocus = true
    },
    handleBlur() {
      this.isFocus = false
    },
    handleKeypress(event) {
      const char = String.fromCharCode(event.which || event.keyCode)
      if (!/[\d.e+-]/.test(char) && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
      }
    },
  },
}
</script>

<style lang="scss">
.custom-input-number {
  width: 100%;
  &.el-input-number.is-controls-right {
    span[role='button'] {
      visibility: hidden;
    }
    &:hover,
    &.is-focus {
      span[role='button'] {
        visibility: visible;
      }
    }
  }
  &.el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
