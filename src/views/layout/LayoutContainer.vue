<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import router from '@/router'
const userStore = useUserStore()
// 页面一加载完就发请求
onMounted(() => {
  userStore.getUserInfo()
})
//
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 提示是否退出
    await ElMessageBox.confirm('确定要进行退出吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 退出登录:
    // 清除本地数据 : token, userInfo
    userStore.removeToken()
    userStore.setUserInfo({}) // 置空
    router.push('/login')
  } else {
    // 跳转
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <!--
  el-menu 整个侧边菜单组件
          :default-active="route.path"  配置默认高亮的菜单项
          -> el-menu-item 菜单项  index="/"  配置跳转
          el-sub-menu  多级菜单
            -> el-menu-item 展开的内容
  -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#863030"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <!-- 具名插槽title, 多级菜单的标题 -->
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          程序员：<strong>{{ userStore.userInfo.username }}</strong>
        </div>
        <!-- 下拉菜单 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 默认展示部分 -->
          <span class="el-dropdown__box">
            <!-- 使用默认头像作为回退，避免未使用的 avatar 导入被标记 -->
            <el-avatar :src="userStore.userInfo.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>文章管理项目 @ kwh</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #963030;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
