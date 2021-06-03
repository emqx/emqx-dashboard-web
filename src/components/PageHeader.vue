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
    white-space: nowrap;
  }

  .page-header-content {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: 0.3s;
    padding: 17px 15px;
    display: flex;
    align-items: center;
  }

  .page-header-title-view {
    .title {
      display: inline-block;
      padding-right: 12px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 700;
      font-size: 16px;
    }
  }

  .page-header-content-view {
    flex-grow: 1;
    padding-right: 10px;
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

}
</style>
