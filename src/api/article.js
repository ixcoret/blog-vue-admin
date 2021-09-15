import request from '@/utils/request'

const baseUrl = '/admin/articles'

export function save(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'post',
    data: data
  })
}

export function list(params) {
  return request({
    url: `${baseUrl}/`,
    method: 'get',
    params: params
  })
}

export function updateArticleDelete(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'put',
    data: data
  })
}

export function getById(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

