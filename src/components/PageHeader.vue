<template>
  <div class="page-header">
    <div class="page-header-content">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link to="/" tag="span" class="btn btn-default raw">
            {{ $t('Base.homePage') }}
          </router-link>
        </a-breadcrumb-item>

        <a-breadcrumb-item>
          <router-link v-if="backPath" :to="backPath" tag="span" class="btn btn-default raw">
            {{ backTitle }}
          </router-link>
          <span v-else class="btn btn-default raw">
            {{ backTitle }}
          </span>
        </a-breadcrumb-item>

        <a-breadcrumb-item v-if="oper">
          <span class="btn btn-default raw">
            {{ oper }}
          </span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  name: 'PageHeader',

  props: {
    backTitle: {
      type: String,
      required: true,
    },
    backPath: {
      type: String,
      default: '',
    },
    oper: {
      type: String,
      default: '',
    },
  },
}
</script>


<style lang="scss">
.page-header {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;

  .page-header-top-start {
    position: absolute;
    right: 24px;
    top: 16px;
  }

  .page-header-content {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: .3s;
    padding: 16px 24px;
    background: #fff;
  }

  .el-breadcrumb, .ant-breadcrumb {
    margin-bottom: 12px;
  }

  .page-header-title-view {
    .title {
      display: inline-block;
      padding-right: 12px;
      color: rgba(0, 0, 0, .85);
      font-weight: 700;
      font-size: 16px;
      line-height: 1.4;

      span {
        margin-right: 8px;
      }
    }
  }

  .page-header-content-view {
    margin-top: 12px;

    .content {
      margin-bottom: 14px;
    }
  }

  .page-header-link {
    margin-top: 16px;

    .link-item {
      margin-right: 12px;
      .icon {
        width: 24px;
        height: 24px;
        line-height: 16px;
        border-radius: 50%;
        border: 1px solid #34C388;
        padding: 4px;
        text-align: center;
        margin-right: 8px;
        font-size: 12px;
      }
    }
  }
}
</style>
