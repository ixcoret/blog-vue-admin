import request from '@/utils/request'

const baseUrl = '/category'
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

export function deleteMany(data) {
  return request({
    url: `${baseUrl}/`,
    method: 'delete',
    data
  })
}

export function list() {
  return request({
    url: `${baseUrl}/`,
    method: 'get'
  })
}

