<template>
  <div class="page-header">
    <div class="page-header-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
}
</script>

<style lang="scss">
.page-header {
  width: auto;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  margin: 24px 24px 0 24px;

  .page-header-top-start {
    position: absolute;
    right: 24px;
    top: 16px;
    &.btn {
      top: 12px;
    }
  }

  .page-header-content {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: 0.3s;
    padding: 16px 24px;
    p {
      margin-bottom: 0px;
    }
  }

  .page-header-title-view {
    .title {
      display: inline-block;
      padding-right: 12px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 700;
      font-size: 16px;
      line-height: 1.4;

      span {
        margin-right: 8px;
      }
    }

    & + .page-header-content-view {
      margin-top: 16px;
    }
  }

  .link-item {
    margin-right: 12px;
    .icon {
      width: 24px;
      height: 24px;
      line-height: 16px;
      border-radius: 50%;
      border: 1px solid #34c388;
      padding: 4px;
      text-align: center;
      margin-right: 8px;
    }
  }

  .description {
    max-width: 500px;
  }
}
</style>
