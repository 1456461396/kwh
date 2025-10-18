<script setup>
import { reactive, ref, onMounted } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { ElMessageBox } from 'element-plus'
import { getUserInfoAPI, updatePasswordAPI } from '@/api/user.js'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
// 安全读取全局用户信息（Pinia 中为 userInfo），避免直接从未定义字段解构导致运行时错误
const user = userStore && userStore.userInfo ? userStore.userInfo : {}

const formRef = ref(null)
const form = reactive({
  id: user.id || '',
  username: user.username || '',
  nickname: user.nickname || '',
  email: user.email || '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
// 表单校验规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      min: 6,
      message: '原密码长度至少 6 位',
      trigger: 'blur',
    },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      min: 6,
      message: '新密码长度至少 6 位',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (!value) return callback(new Error('请输入新密码'))
        if (value === form.oldPassword) return callback(new Error('新密码不能与原密码相同'))
        return callback()
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) return callback(new Error('请确认新密码'))
        if (value !== form.newPassword) return callback(new Error('两次输入的密码不一致'))
        return callback()
      },
      trigger: 'blur',
    },
  ],
}

const isSubmitting = ref(false)
const onSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (_err) {
    ElMessageBox.alert('表单校验未通过，请检查输入', '提示')
    return
  }

  try {
    await ElMessageBox.confirm('确定要重置密码吗？', '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch (_err) {
    // 用户取消
    return
  }

  isSubmitting.value = true
  try {
    // 后端期望 snake_case 字段名 old_pwd / new_pwd
    await updatePasswordAPI({
      old_pwd: form.oldPassword,
      new_pwd: form.newPassword,
      re_pwd: form.confirmPassword,
    })
    ElMessageBox.alert('密码已更新，请使用新密码重新登录（如需）', '成功')
    // 清空本地密码字段
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (err) {
    console.error('修改密码失败', err)
    ElMessageBox.alert('修改密码失败，请稍后重试', '错误')
  } finally {
    isSubmitting.value = false
  }
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
  <page-container title="重置密码:">
    <p class="profile-sub"></p>

    <!-- 表单 -->
    <el-form class="profile-form" label-width="100px" :model="form" :rules="rules" ref="formRef">
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" placeholder="请输入原始密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          v-model="form.newPassword"
          placeholder="请输入6-15位的非空字符作为新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword" placeholder="请输入确认密码" />
      </el-form-item>
      <div class="submit-row">
        <el-button type="primary" :loading="isSubmitting" @click="onSubmit">重置密码</el-button>
      </div>
    </el-form>
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
