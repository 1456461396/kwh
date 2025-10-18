import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 #
// 2. hash模式：   createWebHashHistory 地址栏带 #

// console.log(import.meta.env)
// 路由实例
const router = createRouter({
  // vite 中的环境变量 import.meta.env.BASE_URL  就是 vite.config.js 中的 base 配置项
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    } /* 登录页 */,
    {
      path: '/', // 默认访问页
      // 懒加载:将路由组件返回为一个promise对象
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      //  嵌套路由
      children: [
        // 二级路由
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 默认直接放行 根据返回值决定 放行/拦截
// 1. undefined true -> 放行
// 2. false -> 拦截回到from的页面
// 3. 具体路径 -> 拦截到指定路径
router.beforeEach((to) => {
  const useStore = useUserStore()
  // 没有 token 且 访问的是非登录页 拦截到 登录页
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
