import request from '@/utils/request'

const baseUrl = '/admin/tags'

export function listTags() {
  return request({
    url: `${baseUrl}/`,
    method: 'get'
  })
}

