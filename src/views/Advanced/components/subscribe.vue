<template>
  <div>
    <div class="section-header">
      <div>{{ tl('internalExp') }}</div>
      <el-button size="small" type="primary" @click="openOpDialog">{{
        $t('Base.add')
      }}</el-button>
    </div>

    <el-table>
      <el-table-column :label="'Topic'"></el-table-column>
      <el-table-column :label="'QoS'"></el-table-column>
      <el-table-column :label="'nl/rap/rh'"></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template>
          <el-button size="mini">{{ $t('Base.edit') }}</el-button>
          <el-button size="mini" type="danger">{{ $t('Base.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="opSubs"
      :title="(isEdit ? $t('Base.edit') : $t('Base.add')) + ' ' + tl('subscribe')"
    >
      <el-form>
        <el-form-item :label="'Topic'">
          <el-input></el-input>
        </el-form-item>
        <el-form-item :label="'QoS'">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" v-if="isEdit">{{ $t('Base.update') }}</el-button>
        <el-button size="small" type="primary" v-if="!isEdit">{{ $t('Base.add') }}</el-button>
        <el-button size="small" @click="opSubs = false">{{ $t('Base.cancel') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Subscribe',
  props: ['translate'],

  setup(props) {
    let isEdit = ref(false)
    let opSubs = ref(false)
    let openOpDialog = (edit = false) => {
      opSubs.value = true
      isEdit.value = !!edit
    }
    return {
      tl: props.translate,
      isEdit,
      opSubs,
      openOpDialog,
    }
  },
})
</script>
<style lang="scss" scoped>
</style>