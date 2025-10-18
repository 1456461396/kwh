<script setup>
import { ref } from 'vue'
import { articleCateAddService, articleCateEditService } from '@/api/article'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false) // dialog弹窗
const formRef = ref()

// 表单数据 绑定
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 绑定- model rules 到"大表单"上  prop到"小表单"上   v-model 到输入表单上
// 表单数据 校验
const rules = ref({
  cate_name: [
    { required: true, message: '请输入正确的分类名称', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,9}$/, // 正则校验
      message: '请输入1~9位的中文,字母或数字',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入正确的分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,9}$/,
      message: '分类别名必须是1~9位的字母或数字',
      trigger: 'blur'
    }
  ]
})
const emit = defineEmits(['success'])
const onSubmit = async () => {
  // axios 提交表单时 手动校验数据 检查所有带有 prop属性的 el-form-item是否通过校验规则。
  await formRef.value.validate()
  // 判断时 edit 还是 add
  const isEdit = formModel.value.id
  // console.log(isEdit)
  if (isEdit) {
    await articleCateEditService(formModel.value)
    ElMessage.success('编辑成功!')
  } else {
    await articleCateAddService(formModel.value)
    ElMessage.success('添加成功!')
  }
  dialogVisible.value = false
  // 通知页面大组件 更新
  emit('success') // $emit方法 提交success事件 并在父级的子组件上监听事件 然后触发xx渲染 @success='xx渲染方法'
}

// 组件对外暴露
// 根据传入的参数 空-添加分类; 存在 id name 时-编辑
const open = (parameter) => {
  // console.log(parameter)
  dialogVisible.value = true
  if (parameter === '') {
    return
  } else {
    formModel.value = { ...parameter } // 编辑时 要  回显已经存在的 cate_name cate_alias
  }
}
// 向外暴露
defineExpose({
  open
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form :model="formModel" :rules="rules" ref="formRef">
      <!-- ref="formRef" 大表单 axios请求时要校验数据 -->
      <el-form-item prop="cate_name" label="分类名称">
        <el-input v-model="formModel.cate_name" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="cate_alias" label="分类别名">
        <el-input v-model="formModel.cate_alias" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
