import request from '@/utils/request'

const baseUrl = '/admin/tags'

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

