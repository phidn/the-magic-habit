import { IAxiosResponse, IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TResource, TResourceCreate } from '../schemas/resourceSchema'

interface IResourceService {
  query: (params: IParams) => Promise<IAxiosResponse<TResource[]>>
  get: (id: string) => Promise<IAxiosResponse<TResource>>
  create: (payload: TResourceCreate) => Promise<any>
  update: (id: string, payload: TResource) => Promise<any>
  delete: (id: string) => Promise<any>
}

export const resourceService: IResourceService = {
  query: (params: IParams) => http.get('/resources', { params }),
  get: (id: string) => http.get('/resources/' + id),
  create: (payload: TResourceCreate) => http.post('/resources', payload),
  update: (id: string, payload: TResource) => http.put('/resources/' + id, payload),
  delete: (id: string) => http.delete('/resources/' + id),
}
