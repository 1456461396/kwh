<script setup>
import { userRegisterService, userLoginService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const isRegister = ref(false)
const form = ref() // 绑定到标签上 用于获取el-form组件实例
/* 整个用于提交的form数据对象 */
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
/* 整个用于提交form数据的校验规则 */
const rules = ref({
  username: [
    {
      // 1.非空校验
      required: true,
      message: '请输入用户名',
      // blur失焦时 change改变时 校验
      trigger: 'blur'
    },
    {
      // 2. 长度校验
      min: 2,
      max: 9,
      message: '请输入2~9位的字符'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 3.正则校验
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须为6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  // 4. 自定义校验
  repassword: [
    { required: true, message: '请再次输入密码!', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 判断当前 value 和 formmodel中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致!'))
        } else {
          callback() // 成功也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
})

// 点击注册 触发事件
const register = async () => {
  // 注册成功之前 先校验表单 成功 => 请求. 失败 => 自动提示
  await form.value.validate()
  // console.log('开始注册请求')
  // 注册api 请求
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功!')
  isRegister.value = false
}
// 切换登录/注册时 清空表单内容 - 监听isRegister值的变化
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
// pinia持久化token令牌
const userStore = useUserStore()
const router = useRouter()
// 点击登录 触发事件
const login = async () => {
  try {
    // 表单校验
    await form.value.validate()
  } catch {
    // 校验失败，提示用户
    ElMessage.warning('登录失败!，请检查用户名和密码  ')
    return
  }

  try {
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token) // 持久化token令牌
    router.push('/') // 路由跳转
  } catch (error) {
    // 登录请求失败（例如密码错误），优先显示后端返回的消息
    const msg =
      (error &&
        error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      '登录失败，请检查用户名或密码'
    ElMessage.error(msg)
  }
}
</script>

<template>
  <!--
  el-row表示一行,一行可以分为24份
  el-col表示列, :span=12 表示一列占12份(50%)
                :offset="3" 表示在一行中左侧的margin份数
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 表单数据绑定-校验:
      el-form :modle="ruleForm" 绑定整个form表单的数据 {xxx, xxx, xxx}
      el-form :rules="rules" 绑定整个rules规则对象 {xxx, xxx, xxx}
      表单元素标签 : v-model="ruleForm.xxx"  // 绑定数据
        所在form标签el-form-item使用  prop="xxx"  // 配置rules规则
        axios 发送请求 提交数据:
          手动校验 el-form 绑定formRef :
            await formRef.value.validate()
            检查所有带有 prop属性的 el-form-item是否通过校验规则
      -->

      <!-- v-if isRegister  注册页面 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入2~9位用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回登录
          </el-link>
        </el-form-item>
      </el-form>

      <!-- v-else 登录页面 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            type="text"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
