import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TPermission, TPermissionCreate } from '../schemas/permissionSchema'

export const permissionService = {
  query: <T = any>(params: IParams) => http.get<T>('/v1/permissions', { params }),
  get: <T = any>(id: string) => http.get<T>('/v1/permissions/' + id),
  create: <T = any>(payload: TPermissionCreate) => http.post<T>('/v1/permissions', payload),
  update: <T = any>(id: string, payload: TPermission) =>
    http.put<T>('/v1/permissions/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/v1/permissions/' + id),
  seed: <T = any>() => http.post<T>('/v1/permissions/seed'),
}
