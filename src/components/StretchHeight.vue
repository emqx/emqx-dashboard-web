<template>
  <div id="stretch-height" class="stretch-height" @mousedown="handleMousedown">
    <i class="el-icon-more"></i>
  </div>
</template>

<script>
export default {
  name: 'StretchHeight',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      required: true,
      type: Number,
    },
  },

  data() {
    return {}
  },

  created() {
    document.onmouseup = () => {
      document.onmousemove = null
    }
  },

  methods: {
    handleMousedown(downEvent) {
      let yDown = downEvent.y
      document.onmousemove = (moveEvent) => {
        const yMove = moveEvent.y
        const offset = yMove - yDown
        yDown = moveEvent.y
        this.$emit('change', this.value + offset)
      }
    },
  },
}
</script>

<style lang="scss">
.stretch-height {
  width: 100%;
  height: 10px;
  background: #e6e6e6;
  cursor: row-resize;
  text-align: center;
  .el-icon-more {
    position: relative;
    top: -4px;
  }
}
</style>
