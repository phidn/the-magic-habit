import { TRole, TRoleCreate } from '@mazic/shared'
import { IAxiosResponse, IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

interface IRoleService {
  query: (params: IParams) => Promise<IAxiosResponse<TRole[]>>
  get: (id: string) => Promise<IAxiosResponse<TRole>>
  create: (payload: TRoleCreate) => Promise<any>
  update: (id: string, payload: TRole) => Promise<any>
  delete: (id: string) => Promise<any>
}

export const roleService: IRoleService = {
  query: (params) => http.get('/roles', { params }),
  get: (id) => http.get('/roles/' + id),
  create: (payload) => http.post('/roles', payload),
  update: (id, payload) => http.put('/roles/' + id, payload),
  delete: (id) => http.delete('/roles/' + id),
}
