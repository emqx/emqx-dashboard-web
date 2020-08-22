<template>
  <div class="modules">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Modules.modules') }}
          <span class="modules-num">{{ moduleCount }}</span>
          <el-button class="confirm-btn" type="primary" size="small" @click="$router.push('/modules/add')">
            {{ $t('Base.add') }}
          </el-button>
          <el-col :span="6" :offset="1">
            <el-input
              v-model="searchVal"
              type="text"
              class="search-input"
              size="small"
              clearable
              :placeholder="$t('Modules.searchTip')"
              @input="searchModule"
            >
              <i v-if="!searchLoading" slot="prefix" class="el-icon-search"></i>
              <i v-else slot="prefix" class="el-icon-loading"></i>
            </el-input>
          </el-col>
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <el-row v-if="showList.length" :gutter="20" class="emq-list-card plugin-cards-wrapper">
        <el-col v-for="item in list" :key="item.id" :span="8">
          <div class="module-item" @click="toEditModule(item)">
            <!-- <div class="item-error-tip">
              <span>error</span>
              <el-button class="reconnect-btn" plain size="mini">{{ $t('Modules.reconnect') }}</el-button>
            </div> -->
            <div class="left-box">
              <img :src="item.img" alt="" class="item-img" />
              <div class="item-content">
                <div class="item-title">{{ item.type }}</div>
                <div class="item-des">
                  {{ item.description }}
                </div>
              </div>
            </div>
            <div class="item-handle">
              <el-button
                v-if="item.enabled"
                class="stop-btn"
                plain
                size="mini"
                type="danger"
                @click.stop="updataModule(item, false)"
                >{{ $t('Modules.stop') }}</el-button
              >
              <el-button v-else class="start-btn" plain size="mini" @click.stop="updataModule(item, true)">{{
                $t('Modules.run')
              }}</el-button>
              <a @click.stop="toReadMore" class="know-more">
                {{ $t('Modules.readMore') }}
              </a>
            </div>
          </div>
        </el-col>
      </el-row>
      <a-card v-else class="null-modules">
        <p v-if="list.length">{{ $t('Plugins.listNull') }}</p>
        <p v-else>{{ $t('Modules.noData') }}</p>
      </a-card>
    </div>
    <module-dialog
      from="modules"
      :visible.sync="dialogVisible"
      oper="edit"
      :moduleData="selectModule"
      @updateList="loadData()"
    ></module-dialog>
  </div>
</template>

<script>
import { loadCreatedFeatures, updateFeature } from '@/api/modules'
import { matchSearch } from '@/common/utils'
import moduleDialog from '@/views/Modules/components/moduleDialog.vue'

export default {
  name: 'Modules',

  components: {
    moduleDialog,
  },

  data() {
    return {
      searchLoading: false,
      searchVal: '',
      list: [],
      showList: [],
      dialogVisible: false,
      moduleCount: 0,
      selectModule: {},
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async updataModule(item, val) {
      const data = { ...item }
      data.enabled = val
      if (!val) {
        this.$msgbox
          .confirm(this.$t('Modules.thisActionWillStopTheModule'), {
            confirmButtonText: this.$t('Base.confirm'),
            cancelButtonText: this.$t('Base.cancel'),
            type: 'warning',
          })
          .then(async () => {
            await updateFeature(item.id, data)
            this.$message.success(this.$t('Modules.stopSuccess'))
            item.enabled = val
          })
          .catch(() => {})
      } else {
        await updateFeature(item.id, data)
        this.$message.success(this.$t('Modules.startSuccess'))
        item.enabled = val
      }
    },
    searchModule() {
      this.searchLoading = true
      if (this.searchVal === '') {
        this.showList = this.list
        this.searchLoading = false
        return
      }
      setTimeout(async () => {
        const res = await matchSearch(this.list, 'name', this.searchVal)
        if (res) {
          this.showList = res
          this.searchLoading = false
        } else {
          this.searchLoading = false
        }
      }, 500)
    },
    toEditModule(item) {
      this.selectModule = item
      this.dialogVisible = true
    },
    async loadData() {
      const addedModules = {}
      this.list = []
      this.list = await loadCreatedFeatures()
      this.moduleCount = this.list.length
      if (this.moduleCount) {
        this.list.forEach((item) => {
          // eslint-disable-next-line global-require
          item.img = require('../../assets/plugin_icon/emqx_backend_mysql.png')
          addedModules[item.type] = item.id
        })
        localStorage.setItem('addedModules', JSON.stringify(addedModules))
      } else {
        localStorage.removeItem('addedModules')
      }
      this.showList = this.list
    },
    toReadMore() {
      window.open('https://docs.emqx.net')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/module.scss';

.stop-btn {
  width: 52px;
  color: #ff0000;
  border: 1px solid #ff0000;
  font-size: 14px;
  margin-bottom: 20px;
  background-color: #fbf2f2;
}

.module-item {
  cursor: pointer;
  background-color: #fff;
}
</style>
