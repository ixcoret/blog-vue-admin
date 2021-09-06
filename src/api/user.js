import request from '@/utils/request'

const baseUrl = '/sys/user'

export function login(data) {
  return request({
    url: `${baseUrl}/login`,
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
    url: `${baseUrl}/logout`,
    method: 'get'
  })
}
