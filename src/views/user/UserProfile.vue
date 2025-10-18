<script setup>
import { reactive, ref, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import UserAvatar from './UserAvatar.vue'
import { ElMessage } from 'element-plus'
import { getUserInfoAPI, updateUserInfoAPI } from '@/api/user.js'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
// 安全读取全局用户信息（Pinia 中为 userInfo），避免直接从未定义字段解构导致运行时错误
const user = userStore && userStore.userInfo ? userStore.userInfo : {}

const formRef = ref(null)
const form = reactive({
  id: user.id || '',
  username: user.username || '',
  nickname: user.nickname || '',
  email: user.email || ''
})
// 表单校验规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_.!`-]{1,30}$/,
      message: '长度不能超过 30 个字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ]
}

const isSubmitting = ref(false)
const onSubmit = () => {
  if (!formRef.value) return
  formRef.value
    .validate()
    .then(async () => {
      isSubmitting.value = true
      try {
        await updateUserInfoAPI({ ...form })
        ElMessage.success('用户信息已更新')
        // 刷新全局用户信息，确保其它组件（如头部头像/昵称）和持久化数据一致
        try {
          if (userStore && userStore.getUserInfo) {
            await userStore.getUserInfo()
            const refreshed = userStore.userInfo || {}
            form.username = refreshed.username || form.username
            form.nickname = refreshed.nickname || form.nickname
            form.email = refreshed.email || form.email
          }
        } catch (err) {
          // 忽略刷新失败，但已提示更新成功
          console.warn('刷新用户信息失败', err)
        }
      } catch (err) {
        console.error(err)
        ElMessage.error('更新失败')
      } finally {
        isSubmitting.value = false
      }
    })
    .catch(() => {
      ElMessage.warning('验证失败，请检查表单项')
    })
}

onMounted(async () => {
  try {
    const res = await getUserInfoAPI()
    const user = res && res.data && (res.data.user || res.data)
    if (user) {
      form.username = user.username || user.username || form.username
      form.nickname = user.nickname || user.username || form.nickname
      form.email = user.email || form.email
    }
  } catch (err) {
    console.warn('加载用户信息失败', err)
  }
})
</script>
<template>
  <page-container title="用户资料:">
    <p class="profile-sub">完善/修改你的个人信息，方便其他人识别</p>

    <!-- 表单 -->
    <el-form
      class="profile-form"
      label-width="100px"
      :model="form"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <div class="submit-row">
        <el-button type="primary" :loading="isSubmitting" @click="onSubmit"
          >提交修改</el-button
        >
      </div>
    </el-form>

    <!-- 嵌入更换头像组件 -->
    <user-avatar />
  </page-container>
</template>

<style scoped>
.profile-page {
  padding: 20px;
}
.profile-form-wrapper {
  max-width: 760px;
  margin: 0 auto;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.avatar {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
}
.profile-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.profile-sub {
  margin: 0;
  font-size: 12px;
  color: #888;
}
.profile-form {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.profile-form ::v-deep .el-form-item {
  margin-bottom: 14px;
}
.submit-row {
  text-align: right;
  margin-top: 6px;
}
@media (max-width: 600px) {
  .profile-form {
    padding: 12px;
  }
  .profile-header {
    gap: 10px;
  }
  .profile-title {
    font-size: 16px;
  }
}
</style>
