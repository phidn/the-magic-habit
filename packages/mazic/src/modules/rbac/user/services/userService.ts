import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TUser, TUserCreate } from '../schemas/userSchema'

export const userService = {
  list: <T = any>(params: IParams) => http.get<T>('/users', { params }),
  get: <T = any>(id: string) => http.get<T>('/users/' + id),
  getMe: <T = any>() => http.get<T>('/auth/me'),
  create: <T = any>(payload: TUserCreate) => http.post<T>('/users', payload),
  update: <T = any>(id: string, payload: TUser) => http.put<T>('/users/' + id, payload),
  updateProfile: <T = any>(payload: TUser) => http.put<T>('/users/profile', payload),
  delete: <T = any>(id: string) => http.delete<T>('/users/' + id),
}
