import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token: setToken removeToken
export const useCounterStore = defineStore('big-counter', () => {
  const count = ref(1)
  const add = (n) => {
    count.value += n
  }
  return {
    count,
    add
  }
})
