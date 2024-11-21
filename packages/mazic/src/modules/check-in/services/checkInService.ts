import { THabit } from '@mazic/shared'
import { IAxiosResponse } from '@mazic/types'
import http from '@mazic/utils/http'

import { THabitCheckIn } from '../utils/validations'

interface ICheckInService {
  checkIn: (payload: THabitCheckIn) => Promise<any>
  deleteCheckIn: (id: string) => Promise<any>
  findWidget: (apiKey: string) => Promise<IAxiosResponse<THabit>>
}

export const checkInService: ICheckInService = {
  checkIn: (payload) => http.post('/check-in', payload),
  deleteCheckIn: (id) => http.delete('/check-in/' + id),
  findWidget: (apiKey) => http.get('/habits/widget/' + apiKey),
}
