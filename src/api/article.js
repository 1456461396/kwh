import request from '@/utils/request'
/* 文章 分类  */
export const articleCateGetService = () => request.get('/my/cate/list')

export const articleCateAddService = ({ cate_name, cate_alias }) =>
  request.post('/my/cate/add', { cate_name, cate_alias })

export const articleCateEditService = ({ id, cate_name, cate_alias }) =>
  request.put('/my/cate/info', { id, cate_name, cate_alias })

// 删除是 query参数
export const articleCateDelService = (id) =>
  request.delete('/my/cate/del', { params: { id } })

/* 文章 管理 */
export const articleListGetService = (params) =>
  request.get('/my/article/list', { params })

export const articleAddService = (data) => request.post('my/article/add', data)

export const articleGetInfoService = (id) =>
  request.get('/my/article/info', { params: { id } })

export const articleDeleteService = (id) =>
  request.delete('/my/article/info', { params: { id } })

export const articleUpdateService = (data) =>
  request.put('my/article/info', data)
