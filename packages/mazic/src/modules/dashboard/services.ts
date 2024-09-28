import { IParams } from '@mazic/types/index'
import http from '@mazic/utils/http'

export const services = {
  listHabits: <T = any>(params?: IParams) => http.get<T>('/habits', { params }),
  listHabitsHeatmap: <T = any>(params?: IParams) => http.get<T>('/habits-heatmap', { params }),
}
