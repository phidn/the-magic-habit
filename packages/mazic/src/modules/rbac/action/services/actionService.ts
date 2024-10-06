import { IPaginationApi } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TAction, TActionCreate } from '../schemas/actionSchema'

export const actionService = {
  query: <T = any>(pagination: IPaginationApi) => http.get<T>('/actions', { params: pagination }),
  get: <T = any>(id: string) => http.get<T>('/actions/' + id),
  create: <T = any>(payload: TActionCreate) => http.post<T>('/actions', payload),
  update: <T = any>(id: string, payload: TAction) => http.put<T>('/actions/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/actions/' + id),
}
