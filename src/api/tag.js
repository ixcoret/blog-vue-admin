import request from '@/utils/request'

const baseUrl = '/admin/tags'

export function save(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'post',
    data
  })
}

export function listTagOptions() {
  return request({
    url: `${baseUrl}/options`,
    method: 'get'
  })
}

export function listTags(params) {
  return request({
    url: `${baseUrl}/`,
    method: 'get',
    params: params
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

export function update(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'put',
    data
  })
}

