import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TPermission, TPermissionCreate } from '../schemas/permissionSchema'

export const permissionService = {
  query: <T = any>(params: IParams) => http.get<T>('/permissions', { params }),
  get: <T = any>(id: string) => http.get<T>('/permissions/' + id),
  create: <T = any>(payload: TPermissionCreate) => http.post<T>('/permissions', payload),
  update: <T = any>(id: string, payload: TPermission) => http.put<T>('/permissions/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/permissions/' + id),
  bulkDelete: <T = any>(ids: string[]) => http.post<T>('/permissions/delete', ids),
  seed: <T = any>() => http.post<T>('/permissions/seed'),
}
