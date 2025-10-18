import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token: setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    // token令牌
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    // 用户信息:
    const userInfo = ref({})
    // 1.获得
    const getUserInfo = async () => {
      const res = await userGetInfoService() // api-user 请求
      userInfo.value = res.data.data
    }
    // 2.编辑
    const setUserInfo = (obj) => {
      userInfo.value = obj
    }
    // 向外暴露
    return {
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true /* 是否持久化 */
  }
)
