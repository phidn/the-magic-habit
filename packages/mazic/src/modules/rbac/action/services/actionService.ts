import { IPaginationApi } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TAction, TActionCreate } from '../schemas/actionSchema'

export const actionService = {
  query: <T = any>(pagination: IPaginationApi) =>
    http.get<T>('/v1/actions', { params: pagination }),
  get: <T = any>(id: string) => http.get<T>('/v1/actions/' + id),
  create: <T = any>(payload: TActionCreate) => http.post<T>('/v1/actions', payload),
  update: <T = any>(id: string, payload: TAction) => http.put<T>('/v1/actions/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/v1/actions/' + id),
}
