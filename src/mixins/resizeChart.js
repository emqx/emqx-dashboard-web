// 自动根据窗口大小的改变，进行 resize
export default {
  mounted() {
    setTimeout(() => {
      window.addEventListener('resize', this.chart.resize)
    }, 200)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.chart.resize)
  },
}
