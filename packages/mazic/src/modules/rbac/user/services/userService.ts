import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { TUser, TUserCreate } from '../schemas/userSchema'

export const userService = {
  query: <T = any>(params: IParams) => http.get<T>('/v1/users', { params }),
  get: <T = any>(id: string) => http.get<T>('/v1/users/' + id),
  create: <T = any>(payload: TUserCreate) => http.post<T>('/v1/users', payload),
  update: <T = any>(id: string, payload: TUser) => http.put<T>('/v1/users/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/v1/users/' + id),
}
