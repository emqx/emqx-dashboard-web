<template>
  <div class="custom-pagination">
    <a :class="['prev', page === 1 ? 'disabled' : '']" href="javascript:;" @click="prev">
      <i class="el-icon-arrow-left"></i>
      {{ $t('Base.prev') }}
    </a>
    <a :class="['next', hasnext ? '' : 'disabled']" href="javascript:;" @click="next">
      {{ $t('Base.next') }}
      <i class="el-icon-arrow-right"></i>
    </a>
  </div>
</template>


<script>
export default {
  name: 'CustomPagination',

  props: {
    page: {
      required: true,
      type: Number,
    },
    hasnext: {
      required: true,
      type: Boolean,
    },
  },

  methods: {
    prev() {
      this.$emit('prevClick')
    },
    next() {
      this.$emit('nextClick')
    },
  },
}
</script>


<style lang="scss">
.custom-pagination {
  margin-top: 10px;
  a {
    transition: all .3s ease;
    color: #fff;
    margin-right: 10px;
    background: #34C388;
    display: inline-block;
    border-radius: 4px;
    padding: 5px 8px;
    border: 1px solid #e6e6e6;
    &:hover {
      color: #fff;
    }
  }
  a.disabled {
    transition: all .3s ease;
    color: #606266;
    background: transparent;
    cursor: not-allowed;
  }
}
</style>
