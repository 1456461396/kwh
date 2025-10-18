import request from '@/utils/request'

// 用户注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 用户登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

/* 用户中心 */

// 获取用户基本信息
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    method: 'GET',
    // 请求头携带token（由Pinia统一管理）
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    }
  })
}

// 更新用户基本资料
export const updateUserInfoAPI = (data) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    data
  })
}

// 更新用户头像（接收base64字符串）
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    data: { avatar }
  })
}

// 更新用户密码
export const updatePasswordAPI = (data) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    data
  })
}
