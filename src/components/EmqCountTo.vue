<template>
  <count-to
    v-bind="$attrs"
    class="emq-count-to"
    :startVal="startVal"
    :endVal="endVal"
  >
  </count-to>
</template>


<script>
import countTo from 'vue-count-to'

export default {
  name: 'EmqCountTo',

  components: {
    countTo,
  },

  inheritAttrs: false,

  props: {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  watch: {
    value(val, oldValue) {
      this.startVal = oldValue
      this.endVal = val
    },
  },

  data() {
    return {
      startVal: 0,
      endVal: this.value,
    }
  },

  methods: {},

  created() {},
}
</script>
