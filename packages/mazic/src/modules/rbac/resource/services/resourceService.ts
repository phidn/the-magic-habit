import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TResource, TResourceCreate } from '../schemas/resourceSchema'

export const resourceService = {
  query: <T = any>(params: IParams) => http.get<T>('/resources', { params }),
  get: <T = any>(id: string) => http.get<T>('/resources/' + id),
  create: <T = any>(payload: TResourceCreate) => http.post<T>('/resources', payload),
  update: <T = any>(id: string, payload: TResource) => http.put<T>('/resources/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/resources/' + id),
}
