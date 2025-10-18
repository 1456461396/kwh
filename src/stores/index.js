/* 1: */
/* pinia 独立维护 */
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
/* pinia 导出 */
export default pinia

/* 2: */
/* 仓库统一导出 */
/* 将仓库stores的index作为唯一导出出口,暴露所有的模块 _ */
/* import { useUserStore } from './user'
export { useUserStore }
import { useCounterStore } from './modules/counter'
export { useCounterStore }  麻烦 */
export * from './modules/counter'
export * from './modules/user'
