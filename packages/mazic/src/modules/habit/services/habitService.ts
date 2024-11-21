import { THabit, THabitCreate } from '@mazic/shared'
import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

export const habitService = {
  list: <T = any>(params?: IParams) => http.get<T>('/habits', { params }),
  query: <T = any>(params: IParams) => http.get<T>('/habits', { params }),
  get: <T = any>(id: string) => http.get<T>('/habits/' + id),
  create: <T = any>(payload: THabitCreate) => http.post<T>('/habits', payload),
  update: <T = any>(id: string, payload: THabit) => http.put<T>('/habits/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/habits/' + id),
}
