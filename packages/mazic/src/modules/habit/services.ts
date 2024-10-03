import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

import { THabit, THabitCheckIn, THabitCreate } from './validations'

export const habitService = {
  list: <T = any>(params?: IParams) => http.get<T>('/habits', { params }),
  query: <T = any>(params: IParams) => http.get<T>('/habits', { params }),
  get: <T = any>(id: string) => http.get<T>('/habits/' + id),
  create: <T = any>(payload: THabitCreate) => http.post<T>('/habits', payload),
  update: <T = any>(id: string, payload: THabit) => http.put<T>('/habits/' + id, payload),
  delete: <T = any>(id: string) => http.delete<T>('/habits/' + id),
  checkIn: <T = any>(payload: THabitCheckIn) => http.post<T>('/habits/check-in', payload),
  deleteCheckIn: <T = any>(id: string) => http.delete<T>('/habits/check-in/' + id),
}
