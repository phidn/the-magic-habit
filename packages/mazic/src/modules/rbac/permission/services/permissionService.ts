import { IAxiosResponse, IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TPermission, TPermissionCreate } from '../schemas/permissionSchema'

interface IPermissionService {
  query: (params: IParams) => Promise<IAxiosResponse<TPermission[]>>
  get: (id: string) => Promise<IAxiosResponse<TPermission>>
  create: (payload: TPermissionCreate) => Promise<any>
  update: (id: string, payload: TPermission) => Promise<any>
  delete: (id: string) => Promise<any>
  bulkDelete: (ids: string[]) => Promise<any>
  seed: () => Promise<any>
}

export const permissionService: IPermissionService = {
  query: (params: IParams) => http.get('/permissions', { params }),
  get: (id: string) => http.get('/permissions/' + id),
  create: (payload: TPermissionCreate) => http.post('/permissions', payload),
  update: (id: string, payload: TPermission) => http.put('/permissions/' + id, payload),
  delete: (id: string) => http.delete('/permissions/' + id),
  bulkDelete: (ids: string[]) => http.post('/permissions/delete', ids),
  seed: () => http.post('/permissions/seed'),
}
