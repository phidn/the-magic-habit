import { IAxiosResponse, IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TAction, TActionCreate } from '../schemas/actionSchema'

interface IActionService {
  query: (pagination: IParams) => Promise<IAxiosResponse<TAction[]>>
  get: (id: string) => Promise<IAxiosResponse<TAction>>
  create: (payload: TActionCreate) => Promise<any>
  update: (id: string, payload: TAction) => Promise<any>
  delete: (id: string) => Promise<any>
}

export const actionService: IActionService = {
  query: (pagination) => http.get('/actions', { params: pagination }),
  get: (id) => http.get('/actions/' + id),
  create: (payload) => http.post('/actions', payload),
  update: (id, payload) => http.put('/actions/' + id, payload),
  delete: (id) => http.delete('/actions/' + id),
}
