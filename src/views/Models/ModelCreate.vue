<template>
  <div class="apps">
    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <el-form
          ref="modelRecord"
          :model="modelRecord"
          :rules="modelRules"
          size="small"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('Models.modelName')" prop="thingName">
                <el-input v-model="modelRecord.thingName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="dataType" :label="$t('Models.dataFormat')">
                <el-select
                  v-model="modelRecord.dataType" :disabled="accessType === 'view'"
                >
                  <el-option
                    v-for="(item, index) in modelTypeList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('General.remark')">
                <el-input v-model="modelRecord.thingDesp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="tableData" class="data-list">
          <el-table-column prop="propertyName" :label="$t('Models.attrName')">
            <template slot-scope="{ row }">
              <span class="btn" @click="showDialog('view', row)">
                {{ row.propertyName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="identifier" :label="$t('Models.attrMark')"></el-table-column>
          <el-table-column prop="id" :label="$t('Models.attrId')"></el-table-column>
          <el-table-column prop="dataType" :label="$t('Models.dataType')">
            <template slot-scope="scope">
              {{ dataTypeDic[scope.row.dataType] }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Models.dataSchema')" min-width="150px">
            <template slot-scope="scope">
              <span v-show="scope.row.length">
                {{ $t('Models.length') }}：{{ scope.row.length }}
              </span>
              <span v-show="scope.row.minimum">
                {{ $t('Models.range') }}：{{ scope.row.minimum }}-{{ scope.row.maximum }}
              </span>
            </template>
          </el-table-column>
          <el-table-column>
            <span slot="header" class="btn" @click="showDialog('create')">
              {{ $t('Models.addAttr') }}
            </span>
            <template slot-scope="{ row }">
              <el-button type="dashed" size="mini" @click="showDialog('edit', row)">
                {{ $t('General.edit') }}
              </el-button>
              <el-button
                type="dashed danger"
                size="mini"
                @click="deleteConfirm(row.id)"
              >
                {{ $t('General.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          class="add-model-button"
          @click="createModel"
        >
          {{ $t('Models.createModel') }}
        </el-button>
      </a-card>
    </div>

    <el-dialog
      width="700px"
      :title="accessType === 'edit' ? $t('Models.editAttr') : $t('Models.addAttr')"
      :visible.sync="dialogVisible"
      @close="clearInput"
    >
      <el-form
        ref="recordForm"
        size="small"
        label-position="top"
        :model="record"
        :rules="accessType === 'view' ? {} : rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="propertyName" :label="$t('Models.attrName')">
              <el-input v-model="record.propertyName" :disabled="accessType === 'view'">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="identifier" :label="$t('Models.attrMark')">
              <el-input v-model="record.identifier" :disabled="accessType === 'view'">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="dataType" :label="$t('Models.dataType')">
              <el-radio-group
                v-model="record.dataType"
                :disabled="accessType === 'view'"
                @change="dataTypeChange"
              >
                <template v-if="modelRecord.dataFormat === 'json'">
                  <el-radio
                    v-for="item in jsonDataTypeList"
                    :key="item.value" :label="item.label" class="radio-item"
                  >
                    {{ item.value }}
                  </el-radio>
                </template>
                <template v-else>
                  <el-radio
                    v-for="item in dataTypeList"
                    :key="item.value" :label="item.label" class="radio-item"
                  >
                    {{ item.value }}
                  </el-radio>
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <template v-if="record.dataType !== 'timeStamp'">
            <template v-if="record.dataType && !record.dataType.includes('unfix') && record.dataType !== 'boolean'">
              <el-col :span="12">
                <el-form-item prop="length" :label="$t('Models.length')">
                  <el-select
                    v-if="record.dataType && !record.dataType.includes('fix') && record.dataType !== 'array'"
                    v-model="record.length" :disabled="accessType === 'view'"
                  >
                    <el-option
                      v-for="(item, index) in lengthList[record.dataType]"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    v-else
                    v-model.number="record.length" :placeholder="$t('General.pleaseEnter')"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </template>
            <template
              v-if="record.dataType && !record.dataType.includes('fix') &&
                record.dataType !== 'array' && record.dataType !== 'boolean'"
            >
              <el-col :span="12">
                <el-form-item prop="minimum" :label="$t('Models.minimum')">
                  <el-input v-model.number="record.minimum" :disabled="accessType === 'view'">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="maximum" :label="$t('Models.maximum')">
                  <el-input v-model.number="record.maximum" :disabled="accessType === 'view'">
                  </el-input>
                </el-form-item>
              </el-col>
            </template>
          </template>

          <template v-else>
            <el-col :span="12">
              <el-form-item prop="length" :label="$t('Models.length')">
                <el-select v-model="record.length" :disabled="accessType === 'view'">
                  <el-option
                    v-for="(item, index) in lengthList[record.dataType]"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('Models.timeFormat')">
                {{ $t('Models.formatTip') }}
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <div v-if="accessType !== 'view'" slot="footer" class="dialog-align-footer">
        <el-button plain size="small" @click="dialogVisible = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="save">{{ $t('Base.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  dataTypeList, jsonDataTypeList, dataTypeDic, lengthList,
} from '@/common/modelData'

export default {
  name: 'ModelCreate',

  components: {},

  props: {},

  data() {
    const verifyIsMin = (rule, value, callBack) => {
      if (!value) {
        callBack(new Error(this.$t('Models.isRequired')))
      } else if (!Number.isInteger(Math.abs(value))) {
        callBack(new Error(this.$t('Models.IntErrMsg')))
      } else if (this.record.maximum && (value >= this.record.maximum)) {
        callBack(new Error(this.$t('Models.valErrMsg')))
      } else {
        callBack()
      }
    }
    const verifyIsMax = (rule, value, callBack) => {
      if (!value) {
        callBack(new Error(this.$t('Models.isRequired')))
      } else if (!Number.isInteger(Math.abs(value))) {
        callBack(new Error(this.$t('Models.IntErrMsg')))
      } else if (this.record.minimum && (value <= this.record.minimum)) {
        callBack(new Error(this.$t('Models.valErrMsg')))
      } else {
        callBack()
      }
    }
    return {
      dialogVisible: false,
      tableData: [],
      accessType: '',
      record: {
        dataType: 'integer',
      },
      rules: {
        propertyName: [{ required: true, message: this.$t('Models.isRequired'), trigger: 'blur' }],
        identifier: [{ required: true, message: this.$t('Models.isRequired'), trigger: 'blur' }],
        dataType: [{ required: true }],
        length: [{ required: true, message: this.$t('Models.isRequired'), trigger: 'blur' }],
        minimum: [{ required: true, validator: verifyIsMin, trigger: 'blur' }],
        maximum: [{ required: true, validator: verifyIsMax, trigger: 'blur' }],
      },
      dataLength: 0,
      modelRecord: {},
      modelRules: {
        thingName: [{ required: true, message: this.$t('Models.isRequired'), trigger: 'blur' }],
        dataType: [{ required: true, message: this.$t('Models.isRequired'), trigger: 'blur' }],
      },
      modelTypeList: [
        { label: 'JSON', value: 'json' },
        { label: this.$t('Models.binary'), value: 'bianry' },
      ],
    }
  },

  computed: {
    dataTypeList() {
      return dataTypeList
    },
    jsonDataTypeList() {
      return jsonDataTypeList
    },
    dataTypeDic() {
      return dataTypeDic
    },
    lengthList() {
      return lengthList
    },
  },

  methods: {
    dataTypeChange(val) {
      if (val) {
        this.record = {
          propertyName: this.record.propertyName,
          dataType: this.record.dataType,
          identifier: this.record.identifier,
          id: this.record.id,
        }
        if (val === 'float') {
          this.record.length = 4
        } else if (val === 'double' || val === 'timeStamp') {
          this.record.length = 8
        }
        this.$refs.recordForm.clearValidate()
      }
    },
    clearInput() {
      this.record = {
        dataType: 'integer',
      }
      if (this.$refs.recordForm) {
        this.$refs.recordForm.clearValidate()
      }
    },
    showDialog(type, item) {
      this.dialogVisible = true
      this.accessType = type
      if (type === 'create') {
        this.record = {
          dataType: 'integer',
        }
      } else {
        const record = { ...item }
        this.record = record
      }
    },
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (this.accessType === 'edit') {
          this.tableData.forEach((item) => {
            if (item.id === record.id) {
              const index = this.tableData.indexOf(item)
              this.tableData.splice(index, 1, record)
            }
          })
          this.record = record
          this.$message.success(this.$t('Base.editSuccess'))
        } else {
          record.id = this.dataLength + 1
          this.tableData.unshift(record)
          this.dataLength = this.dataLength + 1
          this.$message.success(this.$t('Base.createSuccess'))
        }
        this.dialogVisible = false
      })
    },
    deleteConfirm(id) {
      this.$msgbox.confirm(this.$t('Models.deleteAttr'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).then(() => {
        if (this.tableData.length === 1) {
          this.tableData = []
        } else {
          this.tableData.forEach((item) => {
            if (item.id === id) {
              const index = this.tableData.indexOf(item)
              this.tableData.splice(index, 1)
            }
          })
        }
        this.$message.success(this.$t('Base.deleteSuccess'))
      }).catch(() => {})
    },
    createModel() {},
  },
}
</script>


<style lang="scss">
.apps {

  .el-select {
    width: 100%;
  }

  .el-date-editor {
    width: 100%;
  }

  .add-model-button {
    margin-top: 24px;
  }

  .radio-item {
    width: 100px;
    margin-right: 25px;
    margin-top: 10px;
  }

  .add-enum-button {
    color: #34C388;
    cursor: pointer;
    margin-top: 20px;
  }
}
</style>
