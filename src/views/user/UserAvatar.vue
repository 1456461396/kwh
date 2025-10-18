<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserInfoAPI, updateAvatarAPI } from '@/api/user.js'
import { useUserStore } from '@/stores'

const avatar = ref('')
const fileInput = ref(null)
const selectedBase64 = ref('')
const isUploading = ref(false)

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (err) => reject(err)
  })

const onChoose = () => {
  fileInput.value && fileInput.value.click()
}

const onFileChange = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  // 限制类型和大小（例如 2MB）
  if (!/^image\//.test(file.type)) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片不能超过 2MB')
    return
  }

  try {
    const base64 = await toBase64(file)
    // 仅预览，实际上传由提交按钮触发
    selectedBase64.value = base64
    avatar.value = base64
  } catch {
    console.error('读取图片失败')
    ElMessage.error('读取图片失败')
  } finally {
    // 不清空 input，这样用户可以在需要时提交；若想允许重复选同一文件，可在提交后清空
  }
}

const userStore = useUserStore()

const submitUpload = async () => {
  if (!selectedBase64.value) {
    ElMessage.warning('请先选择图片')
    return
  }
  isUploading.value = true
  try {
    await updateAvatarAPI(selectedBase64.value)
    ElMessage.success('头像已更新')
    // 清除选中状态并保持预览为新头像
    // 更新全局 userStore 中的头像字段，保证页面其他地方即时刷新
    const newAvatar = avatar.value || selectedBase64.value
    if (userStore && userStore.userInfo) {
      // 如果 userInfo 已有内容，直接设置字段
      try {
        if (Object.keys(userStore.userInfo).length) {
          userStore.userInfo.user_pic = newAvatar
        } else {
          // 否则使用 setUserInfo 覆盖为包含头像的对象
          userStore.setUserInfo({ user_pic: newAvatar })
        }
      } catch {
        // 防御性写入
        userStore.setUserInfo({
          ...(userStore.userInfo || {}),
          user_pic: newAvatar
        })
      }
    }
    selectedBase64.value = ''
    // 清空 file input，方便再次选择同一文件
    if (fileInput.value) fileInput.value.value = ''
  } catch {
    console.error('上传失败')
    ElMessage.error('上传失败')
  } finally {
    isUploading.value = false
  }
}

// 优先使用 Pinia 中已存在的用户头像（userStore.userInfo.user_pic），若不存在则回退到 API 获取
onMounted(async () => {
  try {
    if (userStore && userStore.userInfo && userStore.userInfo.user_pic) {
      avatar.value = userStore.userInfo.user_pic
      return
    }
    const res = await getUserInfoAPI()
    // 假设接口返回结构为 { data: { user: { avatar: 'url or base64' } } } 或 res.data.user_pic
    const apiAvatar =
      (res && res.data && res.data.user && res.data.user.avatar) ||
      (res && res.data && res.data.user_pic) ||
      ''
    avatar.value = apiAvatar

    // 如果 store 为空，尝试把 API 返回写入 store，便于其它组件使用
    try {
      if (userStore && userStore.setUserInfo && apiAvatar) {
        userStore.setUserInfo({
          ...(userStore.userInfo || {}),
          user_pic: apiAvatar
        })
      }
    } catch {
      // ignore
    }
  } catch {
    // 忽略加载错误，保持默认
    console.warn('getUserInfoAPI failed')
  }
})

// 监听全局 userInfo 的头像字段变化，及时同步到本组件
watch(
  () => (userStore && userStore.userInfo ? userStore.userInfo.user_pic : null),
  (val) => {
    if (val) avatar.value = val
  }
)
</script>

<template>
  <p>用户头像:</p>
  <div class="user-avatar">
    <div class="avatar-preview">
      <img v-if="avatar" :src="avatar" alt="avatar" />
      <div v-else class="avatar-placeholder">无头像</div>

      <div class="avatar-actions">
        <el-button type="primary" @click="onChoose">选择图片</el-button>
        <el-button type="success" :loading="isUploading" @click="submitUpload"
          >提交上传</el-button
        >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="onFileChange"
          style="display: none"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.avatar-preview img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
}
.avatar-placeholder {
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ddd;
  border-radius: 8px;
  color: #999;
}
.avatar-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
