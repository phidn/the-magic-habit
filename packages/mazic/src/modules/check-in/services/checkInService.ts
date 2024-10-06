import http from '@mazic/utils/http'

import { THabitCheckIn } from '../utils/validations'

export const checkInService = {
  checkIn: <T = any>(payload: THabitCheckIn) => http.post<T>('/check-in', payload),
  deleteCheckIn: <T = any>(id: string) => http.delete<T>('/check-in/' + id),
}
