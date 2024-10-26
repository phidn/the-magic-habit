import { IAxiosResponse, IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TUser, TUserCreate } from '../schemas/userSchema'

interface IUserService {
  list: (params: IParams) => Promise<IAxiosResponse<TUser[]>>
  get: (id: string) => Promise<IAxiosResponse<TUser>>
  getMe: () => Promise<IAxiosResponse<TUser>>
  create: (payload: TUserCreate) => Promise<any>
  update: (id: string, payload: TUser) => Promise<any>
  updateProfile: (payload: TUser) => Promise<any>
  delete: (id: string) => Promise<any>
}

export const userService: IUserService = {
  list: (params: IParams) => http.get('/users', { params }),
  get: (id: string) => http.get('/users/' + id),
  getMe: () => http.get('/auth/me'),
  create: (payload: TUserCreate) => http.post('/users', payload),
  update: (id: string, payload: TUser) => http.put('/users/' + id, payload),
  updateProfile: (payload: TUser) => http.put('/users/profile', payload),
  delete: (id: string) => http.delete('/users/' + id),
}
