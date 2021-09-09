import request from '@/utils/request'

const baseUrl = '/admin/categories'

export function save(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}

export function deleteBatch(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'delete',
    data
  })
}

export function listCategoryOptions() {
  return request({
    url: `${baseUrl}/options`,
    method: 'get'
  })
}

export function listCategories(params) {
  return request({
    url: `${baseUrl}/`,
    method: 'get',
    params: params
  })
}
