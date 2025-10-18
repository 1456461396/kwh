<script setup>
import { articleCateGetService, articleCateDelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelEditAdd from '@/components/ChannelEditAdd.vue'
import { ElMessage } from 'element-plus'
/* 获取文章列表信息 */
/* loading flag */
const loadingFlag = ref(false)
const articleCateList = ref([])
const dialogRef = ref()
const getArticleCateList = async () => {
  loadingFlag.value = true
  // 发请求
  const res = await articleCateGetService()
  articleCateList.value = res.data.data
  loadingFlag.value = false
}
getArticleCateList()

/* 操作文章列表 编辑/删除 */
const handleDelete = async (index, row) => {
  await ElMessageBox.confirm('确认要删除吗?', '提示!', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await articleCateDelService(row.id)
  ElMessage.success('删除成功!')
  getArticleCateList()
}
const handleEdit = (index, row) => {
  // console.log(index, row)
  dialogRef.value.open(row)
}
/* 添加分类 */
// const dialogVisible = ref(false) // dialog弹窗
const channelEditAdd = () => {
  // 编辑和添加 公用弹层  所以封装成一个组件components
  // dialogVisible.value = true

  // ref 绑定组件后 调用组件暴露出的方法
  dialogRef.value.open()
}
</script>

<template>
  <page-container title="文章分类">
    <!-- 传定制内容 -->
    <template #extra>
      <el-button @click="channelEditAdd" type="primary">添加分类</el-button>
    </template>
    <el-table
      v-loading="loadingFlag"
      :data="articleCateList"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <!-- row 就是articleCateList的每一项,$index是下标 -->
        <template #default="scope">
          <el-button
            :icon="Edit"
            type="primary"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            circle
          >
            <!--  -->
          </el-button>
          <el-button
            :icon="Delete"
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            circle
          >
          </el-button>
        </template>
      </el-table-column>
      <!-- 若没有数据 配一个empty -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 弹层 组件 -->
    <ChannelEditAdd ref="dialogRef" @success="getArticleCateList" />
  </page-container>
</template>

<style lang="scss" scoped></style>
