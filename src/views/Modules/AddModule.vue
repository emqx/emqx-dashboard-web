<template>
  <div class="modules module-add">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          <span class="content-title">{{ $t('components.addModule') }}</span>
          <span class="modules-num">{{ canAddCount }}</span>
          <div
            :class="['module-class', item.id === activeNavId ? 'active-nav' : '']"
            v-for="item in classList"
            :key="item.id"
            @click="changeNav(item.id)"
          >
            {{ item.name }}
          </div>
          <el-col :span="6" :offset="2">
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
    <div class="content-box app-wrapper">
      <template v-if="!searchVal">
        <div v-for="item in classList" :key="item.id" :id="item.id" class="link-content">
          <p :class="['class-title', item.id === activeNavId ? 'active-title' : '']">
            {{ item.name }}
          </p>
          <el-row v-if="allFeatures[item.id]" :gutter="20">
            <el-col v-for="(one, index) in allFeatures[item.id]" :key="index" :span="8">
              <div class="module-item">
                <!-- <div class="item-error-tip">
                  <span>error</span>
                  <el-button class="reconnect-btn" plain size="mini">重连</el-button>
                </div> -->
                <div class="left-box">
                  <img :src="one.img" alt="" class="item-img" />
                  <div class="item-content">
                    <div class="item-title">{{ one.title[lang] }}</div>
                    <div class="item-des">
                      {{ one.description[lang] }}
                    </div>
                  </div>
                </div>
                <div class="item-handle">
                  <el-button
                    v-if="one.status === 'unadd'"
                    class="select-btn"
                    type="dashed"
                    size="mini"
                    @click="toModuleDialog(one, 'add')"
                  >
                    {{ $t('Modules.select') }}
                    <!-- {{ $t('Modules.guide') }} -->
                  </el-button>
                  <el-button v-else class="start-btn" plain size="mini" @click="toModuleDialog(one, 'edit')">
                    {{ $t('Modules.added') }}
                  </el-button>
                  <a href="https://docs.emqx.net" target="_blank" rel="noopener norefferrer" class="know-more">
                    {{ $t('Modules.readMore') }}
                  </a>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-else>
        <el-row v-if="searchModuleInfo.length" :gutter="20">
          <el-col v-for="(one, index) in searchModuleInfo" :key="index" :span="8">
            <div class="module-item">
              <!-- <div class="item-error-tip">
                  <span>error</span>
                  <el-button class="reconnect-btn" plain size="mini">重连</el-button>
                </div> -->
              <div class="left-box">
                <img :src="one.img" alt="" class="item-img" />
                <div class="item-content">
                  <div class="item-title">{{ one.title[lang] }}</div>
                  <div class="item-des">
                    {{ one.description[lang] }}
                  </div>
                </div>
              </div>
              <div class="item-handle">
                <el-button
                  v-if="one.status === 'unadd'"
                  class="select-btn"
                  type="dashed"
                  size="mini"
                  @click="toModuleDialog(one, 'add')"
                >
                  {{ $t('Modules.select') }}
                  <!-- {{ $t('Modules.guide') }} -->
                </el-button>
                <el-button v-else class="start-btn" plain size="mini" @click="toModuleDialog(one, 'edit')">
                  {{ $t('Modules.added') }}
                </el-button>
                <a href="https://docs.emqx.net" target="_blank" rel="noopener norefferrer" class="know-more">
                  {{ $t('Modules.readMore') }}
                </a>
              </div>
            </div>
          </el-col>
        </el-row>
        <a-card v-else class="null-modules">
          <p>{{ $t('Plugins.listNull') }}</p>
        </a-card>
      </template>
    </div>
    <module-dialog :visible.sync="dialogVisible" :moduleData="selectedModule" :oper="oper" @moduleChange="loadData">
    </module-dialog>
  </div>
</template>

<script>
import { loadAllFeatures, showCreatedFeatureInfo } from '@/api/modules'
import { fillI18n, matchSearch } from '@/common/utils'
import store from '@/stores'
import moduleDialog from '@/views/Modules/components/moduleDialog.vue'

export default {
  name: 'ModuleAdd',

  data() {
    return {
      searchLoading: false,
      searchVal: '',
      canAddCount: 0,
      classList: [
        { name: this.$t('Modules.authentication'), id: 'auth' },
        { name: this.$t('Modules.protocols'), id: 'protocol' },
        { name: this.$t('Modules.messagePublish'), id: 'message' },
        { name: this.$t('Modules.monitor'), id: 'devops' },
        { name: this.$t('Modules.localModules'), id: 'module' },
      ],
      activeNavId: 'auth',
      allFeatures: {},
      dialogVisible: false,
      selectedModule: {},
      allModuleList: [],
      searchModuleInfo: [],
      oper: 'add',
    }
  },

  components: {
    moduleDialog,
  },

  computed: {
    lang() {
      return store.state.lang
    },
    addedModules() {
      return JSON.parse(localStorage.getItem('addedModules')) || {}
    },
  },

  created() {
    this.loadData()
  },

  methods: {
    searchModule() {
      this.searchLoading = true
      if (this.searchVal === '') {
        this.searchLoading = false
        this.searchModuleInfo = []
        this.activeNavId = 'auth'
        return
      }
      setTimeout(async () => {
        const res = await matchSearch(this.allModuleList, 'name', this.searchVal)
        if (res) {
          this.searchModuleInfo = res
          this.searchLoading = false
        } else {
          this.searchLoading = false
        }
        this.activeNavId = ''
      }, 500)
    },
    parseI18n(val) {
      const data = fillI18n(val, ['title', 'description']).map((item) => {
        item.params = fillI18n(item.params, true)
        return item
      })
      return data
    },
    toModuleDialog(val, oper) {
      this.oper = oper
      this.selectedModule = {}
      if (oper === 'add') {
        const data = { ...val }
        this.parseI18n([data])
        const { params } = data
        this.selectedModule = {
          paramsData: params,
          type: val.name,
        }
      } else {
        const id = this.addedModules[val.name]
        this.getAddedModuleInfo(id)
          .then((res) => {
            this.selectedModule = res
          })
          .catch()
      }
      this.dialogVisible = true
    },
    async getAddedModuleInfo(id) {
      const data = await showCreatedFeatureInfo(id)
      return data
    },
    changeNav(id) {
      this.searchModuleInfo = []
      this.searchVal = ''
      this.activeNavId = id
      this.$el.querySelector(`#${id}`).scrollIntoView(true)
    },
    async loadData() {
      this.allFeatures = await loadAllFeatures()
      this.getImgs()
      Object.values(this.allFeatures).forEach((item) => {
        this.allModuleList = this.allModuleList.concat(item)
      })
      this.allModuleList.forEach((item) => {
        if (Object.keys(this.addedModules).includes(item.name)) {
          item.status = 'added'
        } else {
          item.status = 'unadd'
          this.canAddCount += 1
        }
      })
    },
    getImgs() {
      this.classList.forEach((item) => {
        const { id } = item
        this.allFeatures[id].forEach((one) => {
          // eslint-disable-next-line global-require
          one.img = require('../../assets/plugin_icon/emqx_backend_mysql.png')
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/module.scss';

.module-add {
  .page-header-content-view {
    .content {
      span {
        flex-shrink: 0;
      }

      .modules-num {
        margin-left: 12px;
        margin-right: 20px;
      }

      .module-class {
        font-size: 14px;
        color: #000000a6;
        margin-right: 20px;
        cursor: pointer;
        flex-shrink: 0;
      }

      .active-nav {
        color: #34c388;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background: #34c388;
          bottom: -15px;
          left: 0px;
        }
      }
    }
  }

  .content-title {
    font-weight: bold;
  }

  .class-title {
    display: block;
    margin-bottom: 30px;
    color: #101010;
    font-weight: bold;
  }

  .content-box {
    padding: 16px 24px;
    margin: 24px;
    background-color: #fff;
  }

  .module-item {
    border: 1px solid #c8c8c8;

    .item-handle {
      text-align: center;
      font-size: 14px;

      .start-btn {
        width: 60px;
      }

      .select-btn {
        margin-bottom: 20px;
        color: #999;
        &:hover {
          color: #23bd78;
        }
      }
    }
  }

  .active-title {
    color: #34c388;
  }

  .link-content {
    padding-top: 80px;
    margin-top: -80px;
  }
}
</style>
