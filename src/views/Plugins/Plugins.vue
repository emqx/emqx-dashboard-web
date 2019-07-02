<template>
  <div class="plugins">
    <el-card class="count-list">
      <div class="count-left">
        <div class="count-title">插件数量</div>
        <div class="count-result">24个插件</div>
      </div>
      <div class="count-center">
        <div class="count-title">已启用</div>
        <div class="count-result">10</div>
      </div>
      <div class="count-right">
        <div class="count-title">错误捕获</div>
        <div class="count-result">22次</div>
      </div>
    </el-card>
    <el-card class="plugin-list">
      <div slot="header">
        <span class="title">插件列表</span>
        <div class="oper">
          <el-radio-group v-model="category" size="mini" @change="changeCategory">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">安全</el-radio-button>
            <el-radio-button label="2">数据</el-radio-button>
            <el-radio-button label="3">功能</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="status" size="mini" @change="changeStatus">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">运行中</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="list-bar">
        <table>
          <tr v-for="item in pluginList" :key="item.name">
            <td><img src="https://www.emqx.io/static/img/logo.png"></td>
            <td>
              <h4 class="name">{{ item.name }}
                <el-tag size="mini" color="transparent">{{ item.type }}</el-tag>
              </h4>
              <p>{{ item.description }}</p>
            </td>
            <td>
              <p>EMQ 官方</p>
              <p>{{ item.version }}</p>
            </td>
            <td>
              <p v-if="item.active" class="status">
                <span class="dot active"></span>已启动
              </p>
              <p v-else class="status">
                <span class="dot"></span>已停止
                <span class="error">错误 1</span>
              </p>
              <p>2019/06/19 11:22:00</p>
            </td>
            <td>
              <el-link v-if="item.active" :underline="false">停止</el-link>
              <el-link v-else type="success" :underline="false">启动</el-link>
              <el-link type="info" :underline="false">配置</el-link>
            </td>
          </tr>
        </table>
      </div>
    </el-card>
  </div>
</template>


<script>

export default {
  name: 'Alerts',

  props: {},

  data() {
    return {
      category: 0,
      status: 0,
      pluginList: [
        {
          name: 'emqx_auth_clientid',
          version: '0.0.0+build.1.ref57de40a',
          description: 'EMQ X Authentication with ClientId/Password',
          active: false,
          type: 'auth',
        },
        {
          name: 'emqx_auth_http',
          version: '0.0.0+build.1.ref18dc4e4',
          description: 'EMQ X Authentication/ACL with HTTP API',
          active: false,
          type: 'feature',
        },
        {
          name: 'emqx_auth_jwt',
          version: '0.0.0+build.1.ref57de40a',
          description: 'EMQ X Authentication with JWT',
          active: true,
          type: 'auth',
        },
      ],
    }
  },

  created() {
  },

  methods: {
    changeCategory(newValue) {
      console.log(newValue)
    },
    changeStatus(newValue) {
      console.log(newValue)
    },
  },
}
</script>


<style lang="scss">
.plugins {
  .count-list {
    overflow: hidden;
    text-align: center;
    padding: 10px 20px;
    margin-bottom: 30px;
    .count-left {
      width: 140px;
      float: left;
    }
    .count-center {
      width: 140px;
      display: inline-block;
    }
    .count-right {
      width: 140px;
      float: right;
    }
    .count-title {
      color: #808080;
      margin-bottom: 10px;
    }
    .count-result {
      color: #101010;
      font-size: 24px;
      font-weight: 400;
    }
  }
  .plugin-list {
    .el-card__header {
      padding: 30px 40px;
      overflow: hidden;
      border: 0;
      .title {
        font-size: 16px;
        color: #000;
      }
      .oper {
        float: right;
        .el-radio-button__inner {
          font-weight: normal;
        }
        .el-radio-button--mini .el-radio-button__inner {
          font-size: 14px;
        }
        .el-radio-group {
          margin-left: 70px;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background-color: transparent;
          color: #34c388;
        }
      }
    }
    .el-card__body {
      padding: 30px 40px;
      .list-bar {
        table {
          width: 100%;
          td {
            padding: 16px 0;
            border-bottom: 1px solid #EDEEF2;
          }
          img {
            width: 48px;
            border-radius: 6px;
            border: 1px solid #bbb;
          }
          h4.name {
            color: #333;
            margin-bottom: 6px;
            .el-tag {
              border-color: #bbb;
              color: #808080;
              font-weight: normal;
              margin-left: 10px;
            }
          }
          p {
            color: #777;
            margin-bottom: 6px;
          }
          td p:last-child {
            margin-bottom: 0;
          }
          .status {
            .dot {
              vertical-align: middle;
              display: inline-block;
              width: 6px;
              height: 6px;
              background-color: #808080;
              border-radius: 3px;
              margin-right: 4px;
              &.active {
                background-color: #34C388;
              }
            }
            .error {
              border-bottom: 1px dashed #bbb;
              margin-left: 10px;
            }
          }
          .el-link {
            margin-right: 16px;
            &.el-link--info {
              color: #aaa;
            }
            &.el-link--success {
              color: #34C388;
            }
          }
        }
      }
    }
  }
}
</style>
