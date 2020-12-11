<template>
  <div class="modules modules-select">
    <div :class="['header-box', $runEnv === 'cloud' ? 'header-box-top' : '']">
      <div class="inner-box">
        <div class="content" :style="contentStyle">
          <div class="content-left">
            <span class="content-title">{{ $t('components.selectModules') }}</span>
            <span v-cloak class="modules-num">{{ canAddCount }}</span>
            <div
              :class="['module-class', item.id === activeNavId ? 'active-nav' : '']"
              v-for="item in classList"
              :key="item.id"
              @click="changeNav(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <el-col :span="6">
            <el-input
              v-model="searchVal"
              type="text"
              class="search-input"
              size="small"
              clearable
              :placeholder="$t('Modules.searchTip')"
              @input="searchModule"
              @clear="loadData"
            >
              <i v-if="!searchLoading" slot="prefix" class="el-icon-search"></i>
              <i v-else slot="prefix" class="el-icon-loading"></i>
            </el-input>
          </el-col>
        </div>
      </div>
    </div>
    <div class="content-box app-wrapper">
      <template v-if="!searchVal">
        <div
          v-for="item in classList"
          :key="item.id"
          :id="item.id"
          :class="$runEnv === 'cloud' ? 'link-content-cloud' : 'link-content'"
        >
          <p :class="['class-title', item.id === activeNavId ? 'active-title' : '']">
            {{ item.name }}
          </p>
          <el-row v-if="allFeatures[item.id]" :gutter="20">
            <el-col v-for="(one, index) in allFeatures[item.id]" :key="index" :span="12">
              <div class="item-box">
                <span
                  v-show="one.id && JSON.stringify(one.params) === '{}'"
                  @click="deleteModule(one, allFeatures[item.id])"
                  class="delete-icon"
                >
                </span>
                <el-card shadow="hover">
                  <div class="module-item" @click="toModuleDetail(one, allFeatures[item.id])">
                    <div class="left-box">
                      <img :src="one.img" alt="module-logo" class="item-img" />
                      <div class="item-content">
                        <div class="item-title">{{ one.title[lang] }}</div>
                        <div class="item-des">
                          {{ one.description[lang] }}
                        </div>
                      </div>
                    </div>
                    <div class="item-handle">
                      <el-button v-if="one.status === 'unadd'" class="select-btn" type="dashed" size="mini">
                        {{ $t('Modules.select') }}
                      </el-button>
                      <el-button v-else class="start-btn" plain size="mini">
                        {{ $t('Modules.added') }}
                      </el-button>
                      <a href="javascript:;" @click.stop="toReadMore(one.name)" class="know-more">
                        {{ $t('Modules.readMore') }}
                      </a>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-else>
        <el-row v-if="searchModuleInfo.length" :gutter="20">
          <el-col v-for="(one, index) in searchModuleInfo" :key="index" :span="12">
            <div class="item-box">
              <span
                v-show="one.id && JSON.stringify(one.params) === '{}'"
                @click="deleteModule(one, searchModuleInfo)"
                class="delete-icon"
              >
              </span>
              <el-card shadow="hover">
                <div class="module-item" @click="toModuleDetail(one, searchModuleInfo)">
                  <div class="left-box">
                    <img :src="one.img" alt="module-logo" class="item-img" />
                    <div class="item-content">
                      <div class="item-title">{{ one.title[lang] }}</div>
                      <div class="item-des">
                        {{ one.description[lang] }}
                      </div>
                    </div>
                  </div>
                  <div class="item-handle">
                    <el-button v-if="one.status === 'unadd'" class="select-btn" type="dashed" size="mini">
                      {{ $t('Modules.select') }}
                    </el-button>
                    <el-button v-else class="start-btn" plain size="mini">
                      {{ $t('Modules.added') }}
                    </el-button>
                    <a href="javascript:;" @click.stop="toReadMore(one.name)" class="know-more">
                      {{ $t('Modules.readMore') }}
                    </a>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <a-card v-else class="null-modules">
          <p>{{ $t('Modules.listNull') }}</p>
        </a-card>
      </template>
    </div>
  </div>
</template>

<script>
import { loadAllModules, showCreatedModuleInfo, createModule, destroyModule } from '@/api/modules'
import { fillI18n, matchSearch } from '@/common/utils'
import store from '@/stores'

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
        { name: this.$t('Modules.extension'), id: 'extension' },
        { name: this.$t('Modules.monitor'), id: 'devops' },
        { name: this.$t('Modules.localModules'), id: 'module' },
      ],
      activeNavId: 'auth',
      allFeatures: {},
      selectedModule: {},
      allModuleList: [],
      searchModuleInfo: [],
      oper: 'add',
      scrollTop: 0,
      scrolling: false,
      addedModules: JSON.parse(localStorage.getItem('addedModules')) || {},
    }
  },

  computed: {
    lang() {
      return store.state.lang
    },
    contentStyle() {
      return { marginLeft: !this.$store.state.leftBarCollapse ? '200px' : '80px' }
    },
  },

  created() {
    this.loadData()
  },

  mounted() {
    window.addEventListener('scroll', this.scrollToTop)
    this.returnPosition()
  },

  destroyed() {
    window.removeEventListener('scroll', this.scrollToTop)
  },

  methods: {
    deleteModule(item, list) {
      const index = list.indexOf(item)
      this.$msgbox
        .confirm(this.$t('Modules.thisActionWillDeleteTheModule'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          await destroyModule(item.id)
          this.$message.success(this.$t('Base.deleteSuccess'))
          const addedModules = JSON.parse(localStorage.getItem('addedModules')) || {}
          delete addedModules[item.name]
          delete this.addedModules[item.name]
          localStorage.setItem('addedModules', JSON.stringify(addedModules))
          const { id, ...oneModule } = item
          oneModule.status = 'unadd'
          list.splice(index, 1, oneModule)
        })
        .catch(() => {})
    },
    returnPosition() {
      const { id, top } = this.$route.query
      if (id) {
        setTimeout(() => {
          document.documentElement.scrollTop = top
          document.body.scrollTop = top
          this.activeNavId = id
        }, 50)
      }
    },
    searchModule() {
      this.searchLoading = true
      if (this.searchVal === '') {
        this.searchLoading = false
        this.searchModuleInfo = []
        this.activeNavId = 'auth'
        return
      }
      setTimeout(async () => {
        const res = await matchSearch(this.allModuleList, 'localTitle', this.searchVal)
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
    async toModuleDetail(val, list) {
      const index = list.indexOf(val)
      const oper = val.status === 'unadd' ? 'add' : 'edit'
      this.oper = oper
      this.selectedModule = {}
      if (oper === 'add') {
        const data = { ...val }
        this.parseI18n([data])
        const { params } = data
        if (!Object.keys(params).length) {
          const requestParams = {
            type: val.name,
            config: {},
          }
          const responseData = await createModule(requestParams)
          const addedModules = JSON.parse(localStorage.getItem('addedModules')) || {}
          addedModules[responseData.type] = responseData.id
          this.addedModules = addedModules
          localStorage.setItem('addedModules', JSON.stringify(addedModules))
          this.$message.success(this.$t('Modules.moduleAddSuccess'))
          val.status = 'added'
          val.id = responseData.id
          list.splice(index, 1, val)
          return
        }
        this.selectedModule = {
          paramsData: params,
          type: val.name,
          oper,
          title: val.title,
          description: val.description,
        }
        this.$store.dispatch('UPDATE_MODULE', this.selectedModule)
      } else {
        if (!Object.keys(val.params).length) {
          this.$message.info(this.$t('Modules.noNeedAddConfigTip'))
          return
        }
        const id = this.addedModules[val.name]
        this.getAddedModuleInfo(id)
          .then((res) => {
            this.selectedModule = res
            this.selectedModule.oper = oper
            this.selectedModule.title = val.title
            this.selectedModule.description = val.description
            this.$store.dispatch('UPDATE_MODULE', this.selectedModule)
          })
          .catch()
      }
      this.$router.push(`/modules/detail?id=${this.activeNavId}&top=${this.scrollTop}`)
    },
    async getAddedModuleInfo(id) {
      const data = await showCreatedModuleInfo(id)
      return data
    },
    changeNav(id) {
      if (this.scrolling) {
        return
      }
      this.searchModuleInfo = []
      this.searchVal = ''
      this.activeNavId = id
      const { offsetTop } = this.$el.querySelector(`#${id}`)
      setTimeout(() => {
        if (id === 'auth') {
          this.backTo(0)
        } else {
          this.backTo(offsetTop)
        }
      }, 5)
    },
    async loadData() {
      this.allModuleList = []
      this.allFeatures = []
      this.canAddCount = 0
      this.allFeatures = await loadAllModules()
      this.getImgs()
      Object.values(this.allFeatures).forEach((item) => {
        this.allModuleList = this.allModuleList.concat(item)
      })
      this.allModuleList.forEach((item) => {
        item.localTitle = item.title[this.lang]
        if (Object.keys(this.addedModules).includes(item.name)) {
          item.status = 'added'
          item.id = this.addedModules[item.name]
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
          try {
            // eslint-disable-next-line
            one.img = require(`../../assets/module_icon/${one.name}.png`)
          } catch (e) {
            console.log(e)
          }
        })
      })
    },
    backTo(targetOffsetTop) {
      const timer = setInterval(() => {
        const ispeed = Math.floor((targetOffsetTop - this.scrollTop) / 6)
        if (Math.abs(this.scrollTop - targetOffsetTop) >= Math.abs(ispeed)) {
          this.scrollTop += ispeed
        } else {
          this.scrollTop = targetOffsetTop
        }
        document.documentElement.scrollTop = this.scrollTop
        document.body.scrollTop = this.scrollTop
        this.scrolling = true
        if (this.scrollTop === targetOffsetTop || ispeed === 0) {
          clearInterval(timer)
          this.scrolling = false
        }
      }, 20)
    },
    scrollToTop() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
    },
    toReadMore(type) {
      const langUrl = this.lang === 'zh' ? 'cn/cn/' : 'io/en/'
      const url = `https://docs.emqx.${langUrl}broker/latest/modules/${type}.html`
      const windowUrl = window.open(url)
      windowUrl.opener = null
    },
  },
}
</script>

<style lang="scss" scoped>
@import './style/module.scss';

.modules-select {
  transform: none;

  .header-box {
    width: 100%;
    height: 112px;
    position: fixed;
    top: 80px;
    right: 0;
    z-index: 9;

    .inner-box {
      background: #f0f2f5;
      padding: 24px;
      box-sizing: border-box;
    }

    .content {
      height: 64px;
      padding: 0 24px;
      box-sizing: border-box;
      background-color: #fff;
      justify-content: space-between;

      .content-left {
        display: flex;
      }

      span {
        flex-shrink: 0;
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

  .header-box-top {
    top: 0;
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
    scroll-behavior: smooth;
    padding: 16px 24px;
    margin: 24px;
    margin-top: 112px;
    background-color: #fff;
  }

  .module-item {
    .item-handle {
      text-align: center;
      font-size: 14px;

      .start-btn {
        width: 60px;
      }

      .select-btn {
        width: 50px;
        font-size: 13px;
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
    padding-top: 200px;
    margin-top: -200px;
  }
  .link-content-cloud {
    padding-top: 120px;
    margin-top: -120px;
  }
}
</style>
