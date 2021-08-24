<template>
  <div>
    <div class="section-header">
      <div></div>
      <el-button size="small" type="primary" @click="openOpDialog()">{{
        $t('Base.add')
      }}</el-button>
    </div>

    <el-table>
      <el-table-column :label="'Action'"></el-table-column>
      <el-table-column :label="tl('sTopic')"></el-table-column>
      <el-table-column :label="'Re'"></el-table-column>
      <el-table-column :label="tl('dTopic')"></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template>
          <el-button size="mini">{{ $t('Base.edit') }}</el-button>
          <el-button size="mini" type="danger">{{ $t('Base.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="opRewrite"
      :title="(isEdit ? $t('Base.edit') : $t('Base.add')) + ' ' + tl('rewrite')"
    >
      <el-form>
        <el-form-item :label="'Action'">
          <el-select></el-select>
        </el-form-item>
        <el-form-item :label="tl('sTopic')">
          <el-input></el-input>
        </el-form-item>
        <el-form-item :label="'Re'">
          <el-input></el-input>
        </el-form-item>
        <el-form-item :label="tl('dTopic')">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" v-if="isEdit">{{ $t('Base.update') }}</el-button>
        <el-button size="small" type="primary" v-if="!isEdit">{{ $t('Base.add') }}</el-button>
        <el-button size="small" @click="opRewrite = false">{{ $t('Base.cancel') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import i18n from '@/i18n'

export default defineComponent({
  name: 'Rewrite',
  props: ['translate'],
  setup(props) {
    let opRewrite = ref(false)
    // let dialogTitle = ref('')
    let isEdit = ref(false)
    let openOpDialog = (edit = false) => {
      opRewrite.value = true
      isEdit.value = !!edit
    }
    return {
      tl: props.translate,
      isEdit,
      opRewrite,
      openOpDialog,
      // dialogTitle,
    }
  },
})
</script>
<style lang="scss" scoped>
</style>