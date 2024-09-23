import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

export const roleService = {
  query: <T = any>(params: IParams) => http.get<T>('/roles', { params }),
  get: <T = any>(id: string) => http.get<T>('/roles/' + id),
  create: <T = any>(payload: any) => http.post<T>('/roles', payload),
  update: <T = any>(id: string, payload: any) => http.put<T>('/roles/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/roles/' + id),
}
