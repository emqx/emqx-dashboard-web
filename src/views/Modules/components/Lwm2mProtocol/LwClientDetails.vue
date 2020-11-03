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
          <div v-loading="listLoading" class="collapse-content">
            <template v-if="Array.isArray(objectResources[item])">
              <el-row class="row-titles">
                <el-col :span="8">
                  <span class="main-black row-title">{{ $t('Schemas.name') }}</span>
                </el-col>
                <el-col :span="2"><span class="main-black row-title">Path</span></el-col>
                <el-col v-if="resourcesOperations[item]" :span="2">
                  <span class="main-black row-title">{{ $t('Modules.dataType') }}</span>
                </el-col>
                <el-col :span="6">
                  <el-button
                    v-if="resourcesOperations[item] && resourcesOperations[item].includes('R')"
                    size="mini"
                    type="primary"
                    @click="batchRead(item)"
                    :loading="btnLoading && clickedButton === `read${item}`"
                  >
                    Read
                  </el-button>
                  <el-button
                    v-if="resourcesOperations[item] && resourcesOperations[item].includes('W')"
                    size="mini"
                    type="primary"
                    @click="batchWrite(item)"
                  >
                    Write
                  </el-button>
                </el-col>
              </el-row>
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
                  <el-col :span="7">
                    <el-button
                      v-if="one.operations.includes('R')"
                      size="mini"
                      :type="one.timeId ? 'primary' : 'dashed'"
                      class="observe-button"
                      @click="doObserve(one)"
                      :loading="btnLoading && clickedButton === `observe${item}`"
                      :disabled="one.timeId !== null && one.timeId !== undefined"
                    >
                      Observe<i class="el-icon-caret-right"></i>
                    </el-button>
                    <el-button
                      v-if="one.operations.includes('R')"
                      size="mini"
                      type="dashed"
                      class="stop-button"
                      @click="cancelObserve(one)"
                      :disabled="!one.timeId"
                      :loading="btnLoading && clickedButton === `cancel-observe${item}`"
                    >
                      <span class="stop-icon"></span>
                    </el-button>
                    <el-button
                      v-if="one.operations.includes('R')"
                      :loading="btnLoading && clickedButton === `read${one.path}`"
                      size="mini"
                      type="dashed"
                      @click="singleRead(one)"
                    >
                      Read
                    </el-button>
                    <el-button v-if="one.operations.includes('W')" size="mini" type="dashed" @click="singleWrite(one)">
                      Write
                    </el-button>
                    <el-button
                      v-if="one.operations.includes('E')"
                      size="mini"
                      type="dashed"
                      :loading="btnLoading && clickedButton === `execute${item}`"
                      @click="doExecute(one)"
                    >
                      Exec
                    </el-button>
                  </el-col>
                  <el-col :span="5">
                    <span
                      v-for="(value, index) in one.values"
                      :key="index"
                      :class="[
                        'row-value-item',
                        one.values[0] === 'Timed out' ||
                        (typeof one.values[0] === 'string' && one.values[0].includes('Error: '))
                          ? 'error-red'
                          : 'main-green',
                      ]"
                    >
                      {{ value }}
                    </span>
                  </el-col>
                </el-row>
              </div>
            </template>
            <template v-else>
              <el-col :span="2" :offset="8">
                <span class="light-gray">
                  {{ objectResources[item] ? objectResources[item] : $t('Modules.noData') }}
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
            <el-col :span="configList.length > 1 || item.dataType === 'Opaque' ? 12 : 24">
              <el-form-item :prop="item.path" label="">
                <div slot="label">
                  <span v-if="item.name.length > 30" :title="item.name">{{ item.name.slice(0, 30) + '...' }}</span>
                  <span v-else>{{ item.name }}</span>
                </div>
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
                <template v-if="item.dataType === 'Opaque'">
                  <el-col :span="16">
                    <el-input v-model="record[item.path]"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-radio v-model="record.encoding[item.path]" label="hex">Hex</el-radio>
                    <el-radio v-model="record.encoding[item.path]" label="plain">Plain</el-radio>
                  </el-col>
                </template>
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
import { getLwClients, getOrderResponse, publishOrder } from '@/api/modules'

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
      record: {
        dataType: {},
        encoding: {},
      },
      rules: {},
      writeDialogVisible: false,
      readTimeId: null,
      resourcesOperations: {},
      btnLoading: false,
      clickedButton: '',
      listLoading: false,
    }
  },

  watch: {
    activeName: {
      handler(newName, oldName) {
        if (!newName && oldName && Array.isArray(this.objectResources[oldName])) {
          this.objectResources[oldName].forEach((one) => {
            this.clearTimer(one.timeId)
          })
        }
      },
      deep: true,
    },
  },

  created() {
    this.loadObjectList()
  },

  beforeDestroy() {
    if (this.activeName && Array.isArray(this.objectResources[this.activeName])) {
      this.objectResources[this.activeName].forEach((one) => {
        this.clearTimer(one.timeId)
      })
    }
    this.clearTimer(this.readTimeId)
  },

  methods: {
    async publishOneOrder(msgType, data) {
      const body = {
        topic: `lwm2m/${this.currentImei}/dn`,
        payload: {
          reqID: '2',
          msgType,
          data,
        },
      }
      await publishOrder(body)
    },

    clearTimer(timeId) {
      if (timeId) {
        clearInterval(timeId)
      }
    },

    async loadObjectList() {
      const data = await getLwClients()
      const res = data.filter(($) => $.imei === this.currentImei)
      this.objectList = res[0].objectList

      const sortByPath = (valOne, valTwo) => {
        const intOne = parseInt(valOne.replace('/', ''), 10)
        const intTwo = parseInt(valTwo.replace('/', ''), 10)
        if (intOne > intTwo) {
          return 1
        }
        return -1
      }
      this.objectNames = Object.keys(this.objectList).sort(sortByPath)
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
        this.listLoading = true
        this.publishOneOrder('discover', { path })
        this.resourcesOperations[path] = ''
        const { content, codeMsg } = await getOrderResponse(this.currentImei, 'discover', path)
        if (Array.isArray(content)) {
          this.initObjectResourseValues(content)
          this.objectResources[path] = content

          content.forEach((one) => {
            if (one.operations.includes('W')) {
              this.resourcesOperations[path] = this.resourcesOperations[path].concat('W')
            } else if (one.operations.includes('R')) {
              this.resourcesOperations[path] = this.resourcesOperations[path].concat('R')
            }
          })
        } else if (typeof content === 'object' && !Array.isArray(content)) {
          this.objectResources[path] = []
          Object.keys(content).forEach((key) => {
            const oneResource = {
              name: key,
              path: content[key],
              operations: '',
            }
            this.objectResources[path].push(oneResource)
          })
        } else if (codeMsg) {
          this.objectResources[path] = codeMsg
        }
        this.listLoading = false
      }
    },

    // read observe cancle-observe execute
    pubOrderByButton(way, path, timeId) {
      this.btnLoading = true
      this.clickedButton = `${way}${path}`
      this.publishOneOrder(way, { path })
      this.clearTimer(timeId)
    },

    intervalGetReadResult(assignValueFunction, path, object) {
      const showErrorFunction = (errMsg) => {
        this.clearTimer(this.readTimeId)
        if (Array.isArray(object)) {
          object.forEach((one) => {
            one.values = [`${errMsg}`]
          })
        } else {
          object.values = [`${errMsg}`]
        }
      }
      let count = 0
      this.readTimeId = setInterval(async () => {
        try {
          count += 1
          const { content } = await getOrderResponse(this.currentImei, 'read', path)
          if (content) {
            assignValueFunction(content)
            this.clearTimer(this.readTimeId)
          } else if (count >= 10) {
            showErrorFunction('Timed out', object)
          }
        } catch (err) {
          showErrorFunction(`Error: ${err.toString()}`, object)
        }
        this.btnLoading = false
      }, 1000)
    },

    batchRead(path) {
      this.pubOrderByButton('read', path, this.readTimeId)
      this.initObjectResourseValues(this.objectResources[path])
      this.intervalGetReadResult(
        (content) => {
          content.forEach((item) => {
            this.objectResources[path].forEach((one) => {
              if (item.path.includes(`${one.path}/`) || item.path === one.path) {
                one.values.push(item.value)
              }
            })
          })
        },
        path,
        this.objectResources[path],
      )
    },

    singleRead(one) {
      this.pubOrderByButton('read', one.path, this.readTimeId)
      this.intervalGetReadResult(
        (content) => {
          const valueArr = []
          content.forEach((item) => {
            valueArr.push(item.value)
          })
          one.values = valueArr
        },
        one.path,
        one,
      )
    },

    async getObserveResult(way, one) {
      try {
        const { content } = await getOrderResponse(this.currentImei, way, one.path)
        if (content) {
          const valueArr = []
          content.forEach((item) => {
            valueArr.push(item.value)
          })
          one.values = valueArr
        }
      } catch (err) {
        this.clearTimer(one.timeId)
        one.values = [`Error: ${err.toString()}`]
      }
    },

    doObserve(one) {
      this.pubOrderByButton('observe', one.path, one.timeId)
      this.getObserveResult('observe', one)
      one.timeId = setInterval(() => {
        this.getObserveResult('observe', one)
      }, 5000)
    },

    cancelObserve(one) {
      this.pubOrderByButton('cancel-observe', one.path, one.timeId)
      this.getObserveResult('cancel-observe', one)
      one.timeId = null
    },

    doExecute(one) {
      this.$confirm(`Are you sure to ${one.name}?`, this.$t('Base.warning'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          this.pubOrderByButton('execute', one.path)
          const { code, codeMsg } = await getOrderResponse(this.currentImei, 'execute', one.path)
          if (code && parseFloat(code) < 3) {
            this.$message.success(this.$t('Base.operateSuccess'))
          } else if (codeMsg) {
            this.$message.error(codeMsg)
          }
        })
        .catch(() => {})
    },

    batchWrite(path) {
      this.writeDialogVisible = true
      this.objectResources[path].forEach((item) => {
        if (item.operations.includes('W')) {
          this.configList.push(item)
          const { path: resourcePath, dataType } = item
          this.record.dataType[resourcePath] = dataType
        }
        if (item.dataType === 'Opaque') {
          this.record.encoding[item.path] = 'plain'
        }
      })
      this.record.basePath = path
    },

    singleWrite(one) {
      this.writeDialogVisible = true
      this.configList.push(one)
      this.record.dataType[one.path] = one.dataType
      if (one.dataType === 'Opaque') {
        this.record.encoding[one.path] = 'plain'
      }
    },

    async handleWrite() {
      const content = []
      const { basePath, dataType, encoding, ...record } = this.record
      Object.keys(record).forEach((key) => {
        if (dataType[key] === 'Boolean') {
          record[key] = record[key] === 'true'
        } else if (dataType[key] === 'Time') {
          const dataTime = new Date(record[key]).getTime()
          record[key] = Math.floor(dataTime / 1000)
        }
        const oneResource = {
          path: key,
          type: dataType[key],
          value: record[key],
        }
        if (dataType[key] === 'Opaque') {
          oneResource[encoding] = encoding[key]
        }
        content.push(oneResource)
      })
      const data = basePath ? { basePath, content } : content[0]
      const path = basePath || data.path
      this.publishOneOrder('write', data)
      const { code, codeMsg } = await getOrderResponse(this.currentImei, 'write', path)

      if (code && parseFloat(code) < 3) {
        this.$message.success(this.$t('Base.editSuccess'))
        const pathSplitArr = content[0].path.split('/')
        const onePath = `/${pathSplitArr[1]}/${pathSplitArr[2]}`
        const rootPath = basePath || onePath
        this.objectResources[rootPath].forEach((one) => {
          content.forEach((item) => {
            if (one.path === item.path) {
              one.values = [item.value]
            }
          })
        })
      } else if (codeMsg) {
        this.$message.error(codeMsg)
      }
      this.handleClose()
    },

    handleClose() {
      this.writeDialogVisible = false
      this.configList = []
      this.$refs.record.resetFields()
      this.record = {
        dataType: {},
        encoding: {},
      }
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
  .el-col-16 {
    padding-left: 0;
  }

  .error-red {
    color: #f5222d;
  }

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

    .data-type {
      display: inline-block;
    }

    .content-item-row {
      min-height: 36px !important;

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
