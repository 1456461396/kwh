<script setup>
import ChannelSelect from '@/components/ChannelSelect.vue'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  articleAddService,
  articleGetInfoService,
  articleUpdateService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'

const emit = defineEmits(['success'])

// 初始数据
const visibleDrawer = ref(false)
const defaultModel = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
const formModel = ref({ ...defaultModel }) // 抽屉的表单数据 默认为空
const imgUrl = ref('')
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  formModel.value.cover_img = uploadFile.raw
}
// 点击 edit/添加文章 to 打开抽屉 -- 编辑文章 or 发布文章
const flag = ref('add')
const open = async (row) => {
  // 抽屉可见
  visibleDrawer.value = true
  if (row.id) {
    // 1. 编辑文章表单显示:
    flag.value = 'edit'
    // 回显数据 因为请求到的数据没有cover_img 和 content 所以需要自己发送请求回显 获取文章列表详情
    // 关键：调用接口获取文章详情（包含cover_img和content）
    const { data: articleDetail } = await articleGetInfoService(row.id)
    // console.log(articleDetail.data)
    formModel.value = { ...articleDetail.data } // 回显数据
    // 因为
    imgUrl.value = baseURL + formModel.value.cover_img //  封面图片 单独处理
    // console.log('imgUrl:', imgUrl.value)
    // 最后将网络图片地址 转为 file对象  便于提交
    const imgFile = await imgUrlToFileObj(
      imgUrl.value,
      formModel.value.cover_img,
      'image/jpeg'
    )
    formModel.value.cover_img = imgFile
  } else {
    // 2. 添加文章表单显示:
    formModel.value = { ...defaultModel }
  }
}
// 封面图片url  转 file对象
async function imgUrlToFileObj(url, filename, mimeType) {
  try {
    // 1. 获取图片数据
    const response = await fetch(url)
    const blob = await response.blob()

    // 2. 转换为 File 对象
    return new File([blob], filename, { type: mimeType || blob.type })
  } catch (error) {
    console.error('转换失败:', error)
    throw error
  }
}

// 点击: 发布\草稿
const onPublish = async (state) => {
  formModel.value.state = state // 判断是 '发布\草稿'

  // 创建发请求的 form-data // 请求参数 要求是form-data'格式'
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 1.更新文章
  if (formModel.value.id) {
    // 回显编辑时的提交
    await articleUpdateService(fd)
    visibleDrawer.value = false
    ElMessage({ message: '更新成功', type: 'success' })
    emit('success', 'edit')
  } else {
    // 2.发布文章
    await articleAddService(fd)
    visibleDrawer.value = false
    ElMessage({ message: '添加成功', type: 'success' })
    /* 通知父组件 操作 */
    emit('success', 'add')
  }
}

defineProps({
  // el-select 数据
  modelValue: {
    type: [Number, String]
  }
})

defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="flag === 'edit' ? '编辑文章' : '添加文章'"
    direction="rtl"
    class="demo-drawer"
    size="50%"
  >
    <div class="demo-drawer__content">
      <el-form>
        <el-form-item label="文章标题:">
          <el-input
            v-model="formModel.title"
            placeholder="请输入文章标题"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="文章分类:">
          <ChannelSelect v-model="formModel.cate_id" />
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 封面上传  -->
          <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onUploadFile"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="editor">
            <quill-editor
              theme="snow"
              v-model:content="formModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="onPublish('已发布')" type="primary"
            >发布</el-button
          >
          <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 128px;
      height: 128px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 128px;
      height: 128px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
