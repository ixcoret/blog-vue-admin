import request from '@/utils/request'

const baseUrl = '/user'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: `${baseUrl}/info`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `/logout`,
    method: 'get'
  })
}
