<template>
  <div class="lw-client-details">
    <a-card class="emq-list-card">
      <div class="detail-header">
        <a href="javascript:;" @click="backListPage">
          <i class="el-icon-arrow-left">
            {{ $t('components.clients') }}
          </i>
        </a>
        <span class="endpoint">{{ $route.query.imei }}</span>
      </div>
    </a-card>
    <a-card class="emq-list-card">
      <el-collapse v-model="activeName" accordion @change="handleObjectChange">
        <el-collapse-item v-for="(item, index) in objectNames" :key="index" title="" :name="item">
          <div class="collapse-title" slot="title">
            <el-col :span="8">
              <span class="main-green">{{ objectList[item] }}</span>
            </el-col>
            <el-col :span="4">
              <span class="light-gray">{{ item }}</span>
            </el-col>
          </div>
          <div class="collapse-content">
            <el-row v-if="objectResources[item].length" class="row-titles">
              <el-col :span="8">
                <span class="main-black row-title">name</span>
              </el-col>
              <el-col :span="2"><span class="main-black row-title">path</span></el-col>
              <el-col :span="2">
                <span class="main-black row-title">{{ $t('Modules.dataType') }}</span>
              </el-col>
              <el-col :span="6">
                <el-button size="mini" type="dashed" @click="batchRead(item)">Read</el-button>
                <el-button size="mini" type="dashed" @click="batchWrite(item)">Write</el-button>
              </el-col>
            </el-row>
            <template v-if="objectResources[item].length">
              <div v-for="(one, index) in objectResources[item]" :key="index" class="content-item">
                <el-row :class="index < objectResources[item].length - 1 ? 'content-item-row' : ''">
                  <el-col :span="8">
                    <span class="main-black">{{ one.name }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="light-gray">{{ one.path }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span class="light-gray data-type">{{ one.dataType }}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button v-if="one.operations.includes('R')" size="mini" type="dashed" class="observe-button">
                      Observe<i class="el-icon-caret-right"></i>
                    </el-button>
                    <el-button v-if="one.operations.includes('R')" size="mini" type="dashed" class="stop-button">
                      <span class="stop-icon"></span>
                    </el-button>
                    <el-button v-if="one.operations.includes('R')" size="mini" type="dashed">
                      Read
                    </el-button>
                    <el-button v-if="one.operations.includes('W')" size="mini" type="dashed" @click="singleWrite(one)">
                      Write
                    </el-button>
                    <el-button v-if="one.operations.includes('E')" size="mini" type="dashed">
                      Exec
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <span v-for="(value, index) in one.values" :key="index" class="row-value-item main-green">
                      {{ value }}
                    </span>
                  </el-col>
                </el-row>
              </div>
            </template>
            <template v-else>
              <el-col :span="2" :offset="8">
                <span class="light-gray">
                  {{ $t('Modules.noData') }}
                </span>
              </el-col>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
    </a-card>

    <el-dialog
      title=""
      :width="configList.length > 1 ? '520px' : '400px'"
      :visible.sync="writeDialogVisible"
      class="create-subscribe"
      @close="handleClose"
    >
      <el-form ref="record" class="el-form--public" :model="record" :rules="rules" size="small" label-position="top">
        <el-row :gutter="20">
          <div v-for="(item, index) in configList" :key="index">
            <el-col :span="configList.length > 1 ? 12 : 24">
              <el-form-item :prop="item.path" :label="item.name">
                <emq-select
                  v-if="item.dataType === 'Boolean'"
                  v-model="record[item.path]"
                  :field="{ list: ['true', 'false'] }"
                >
                </emq-select>
                <el-input v-else-if="item.dataType === 'String'" v-model="record[item.path]"></el-input>
                <template v-else-if="item.dataType === 'Time'">
                  <el-date-picker v-model="record[item.path]" type="datetime"> </el-date-picker>
                </template>
                <el-input-number
                  v-else-if="item.dataType === 'Integer'"
                  v-model.number="record[item.path]"
                  controls-position="right"
                  :precision="0"
                ></el-input-number>
                <el-input-number
                  v-else-if="item.dataType === 'Float'"
                  v-model.number="record[item.path]"
                  controls-position="right"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="handleClose">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="handleWrite">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLwClients, getLwResources, doBatchRead } from '@/api/modules'

export default {
  name: 'LwClientDetails',

  data() {
    return {
      activeName: '',
      objectNames: [],
      objectList: {},
      objectResources: {},
      currentImei: this.$route.query.imei,
      configList: [],
      record: {},
      rules: {},
      writeDialogVisible: false,
    }
  },

  created() {
    this.loadObjectList()
  },

  methods: {
    async loadObjectList() {
      const data = await getLwClients()
      const res = data.filter(($) => $.imei === this.currentImei)
      this.objectList = res[0].objectList
      this.objectNames = Object.keys(this.objectList)
      this.objectNames.forEach((key) => {
        this.$set(this.objectResources, key, [])
      })
    },

    initObjectResourseValues(list) {
      list.forEach((item) => {
        if (item.operations.includes('R')) {
          item.values = []
        }
      })
    },

    async handleObjectChange(path) {
      if (path) {
        const { content } = await getLwResources(this.currentImei, path)
        if (content) {
          this.initObjectResourseValues(content)
          this.objectResources[path] = content
        }
      }
    },

    async batchRead(path) {
      this.initObjectResourseValues(this.objectResources[path])
      const { content } = await doBatchRead(this.currentImei, path)
      if (content) {
        content.forEach((item) => {
          this.objectResources[path].forEach((one) => {
            if (item.path.includes(`${one.path}/`) || item.path === one.path) {
              one.values.push(item.value)
            }
          })
        })
      }
    },

    batchWrite(path) {
      this.writeDialogVisible = true
      this.objectResources[path].forEach((item) => {
        if (item.operations.includes('W')) {
          this.configList.push(item)
        }
      })
    },

    singleWrite(one) {
      this.writeDialogVisible = true
      this.configList.push(one)
    },

    handleWrite() {},

    handleClose() {
      this.writeDialogVisible = false
      this.configList = []
      this.$refs.record.resetFields()
    },

    backListPage() {
      this.$router.push({
        path: '/modules/manage',
        query: {
          type: 'lwm2m_protocol',
        },
      })
    },
  },
}
</script>

<style lang="scss">
.lw-client-details {
  .main-green {
    color: #34c388;
  }

  .main-black {
    color: #101010;
  }

  .light-gray {
    color: #00000073;
  }

  .row-title {
    font-size: 16px;
    font-weight: 600;
  }

  .emq-list-card {
    &:first-child {
      margin-bottom: 24px;

      .detail-header {
        .el-icon-arrow-left {
          font-weight: 600;
        }

        .endpoint {
          display: inline-block;
          margin-left: 20px;
        }
      }
    }
  }
  .collapse-title {
    width: 100%;
    font-size: 14px;
  }

  .collapse-content {
    padding: 20px;
    padding-bottom: 0px;

    .row-titles {
      min-height: 42px !important;
    }

    .content-item-row {
      min-height: 36px !important;

      .data-type {
        display: inline-block;
        min-width: 80px;
      }

      .row-value-item {
        display: inline-block;
        margin-right: 10px;
      }
    }
    .stop-button {
      margin-left: 1px;

      &:hover {
        .stop-icon {
          background-color: #34c388;
        }
      }

      .stop-icon {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: rgba(0, 0, 0, 0.65);
      }
    }
    .observe-button {
      position: relative;
      padding-right: 18px;

      .el-icon-caret-right {
        font-size: 16px;
        position: absolute;
        right: 1px;
        bottom: 2px;
      }
    }
  }
  // el-collapse
  .el-collapse-item__content {
    padding-bottom: 0;
    font-size: 14px;
  }

  .el-collapse-item__header {
    padding-left: 12px;
    border-radius: 2px;
  }

  .el-collapse-item__arrow {
    color: #34c388;
    font-size: 14px;
    font-weight: 600;
  }

  .el-collapse-item__wrap {
    padding-bottom: 20px;
    background-color: #f8f9fc;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
