import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

export const roleService = {
  query: <T = any>(params: IParams) => http.get<T>('/v1/roles', { params }),
  get: <T = any>(id: string) => http.get<T>('/v1/roles/' + id),
  create: <T = any>(payload: any) => http.post<T>('/v1/roles', payload),
  update: <T = any>(id: string, payload: any) => http.put<T>('/v1/roles/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/v1/roles/' + id),
}
