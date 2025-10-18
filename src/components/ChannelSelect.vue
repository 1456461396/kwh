<script setup>
import { articleCateGetService } from '@/api/article'
import { ref } from 'vue'
const channelList = ref([])
const getChannelList = async () => {
  const res = await articleCateGetService()
  channelList.value = res.data.data
}
getChannelList()

/* Vue3 父子组件传递数据双向绑定: */
// 1:定义props 接受父组件传来的数据
defineProps({
  modelValue: {
    type: [Number, String]
  }
})
// 2:子组件向 父组件传递数据-自定义事件 子通过 emit传父
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <!-- 接受 父组件传过来的数据 -->
    <!-- label是展示出来的值  而value是实际的值 -->
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>
