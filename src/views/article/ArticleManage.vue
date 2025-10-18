<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from '@/components/ChannelSelect.vue'
import { articleListGetService, articleDeleteService } from '@/api/article'
import ArticleAdd from '@/components/ArticleAdd.vue'
import { formatTime } from '@/utils/format'

// 加载效果
const loading = ref(false)
// 动态渲染的文章列表
const articleList = ref([]) // 文章列表
const total = ref(0) // list总条数
// 定义请求参数对象
// 传递给select组件数据
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 每页条数
  cate_id: '',
  state: ''
})
/* 根据params 请求数据 */
const getArticleList = async () => {
  loading.value = true
  const res = await articleListGetService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 搜索/重置
const onSearch = () => {
  // 重置当前页
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  // 清空筛选条件
  params.value.cate_id = ''
  params.value.state = ''
  // 重置当前页
  params.value.pagenum = 1
  getArticleList()
}

/* edit */
const onEdit = (row) => {
  DrawerRef.value.open(row) // 回显数据
}
/* delete */
const onDelete = async (row) => {
  // 弹窗确认，用户取消会抛出拒绝，需捕获以避免未处理的 promise 错误
  try {
    await ElMessageBox.confirm('确认要删除吗?', '提示!', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    // 用户点击取消或关闭弹窗，直接返回不做任何操作
    return
  }

  // 确认后执行删除并捕获可能的请求错误
  try {
    await articleDeleteService(row.id)
    ElMessage.success('删除成功!')
    getArticleList()
  } catch (err) {
    console.error('删除文章失败', err)
    ElMessage.error('删除失败，请稍后重试')
  }
}

// 添加 文章 1.弹出 抽屉:
const DrawerRef = ref() // ref 绑定组件
const onAddArticle = () => {
  DrawerRef.value.open({})
}

// 分页逻辑
const onSizeChange = (size) => {
  // 修改 每页数据条数
  params.value.pagesize = size
  // 当前页pagenum  前往 第一页
  params.value.pagenum = 1
  getArticleList()
}
const onCurrentChange = (page) => {
  // 当前页pagenum 变化了 更新当前页
  params.value.pagenum = page
  getArticleList()
}

// 发布/编辑  成功事件
const onSuccess = (state) => {
  if (state === 'add') {
    // 添加文章
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数量 再渲染
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <!-- 传定制内容 -->
    <template #extra>
      <el-button @click="onAddArticle" type="primary">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类" style="width: 200px">
        <ChannelSelect v-model="params.cate_id" />
        <!-- 父子组件双向绑定 绑定父组件数据 可用于'搜索'时 传递参数更新页面   -->
      </el-form-item>
      <el-form-item label="发布状态:" style="width: 200px">
        <el-select v-model="params.state">
          <el-option value="已发布" />
          <el-option value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item inline="true">
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" underline="never">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文章分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            type="primary"
            size="small"
            @click="onEdit(row)"
            circle
          >
          </el-button>
          <el-button
            :icon="Delete"
            size="small"
            type="danger"
            @click="onDelete(row)"
            circle
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -:page-sizes="[2, 3, 4, 5, 10]" 可供选择的每页条数   -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 添加文章-抽屉组件 -->
    <ArticleAdd ref="DrawerRef" :data="articleList" @success="onSuccess" />
  </page-container>
</template>

<style lang="scss" scoped></style>
