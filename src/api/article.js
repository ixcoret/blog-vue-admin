import request from '@/utils/request'

const baseUrl = '/admin/articles'

export function save(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: `${baseUrl}/`,
    method: 'get',
    params: params
  })
}

