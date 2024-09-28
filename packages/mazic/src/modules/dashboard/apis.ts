import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { ApiResponse, IParams } from '@mazic/types/index'

import { services } from './services'
import { THabit } from './validations'

const QUERY_KEY = 'habits' as const

export const apis = {
  useList: (params?: IParams) => {
    const { data, ...rest } = useQuery({
      queryFn: () => services.listHabits<ApiResponse<THabit[]>>(params),
      queryKey: [QUERY_KEY, 'listHabits', params],
    })
    const dataList = (data?.data?.data || []).map((item) => {
      item.activities = (item.entries || []).map((entry) => {
        return {
          date: dayjs(entry.date).format('YYYY-MM-DD'),
          count: entry.count,
          level: entry.level,
        }
      })
      return item
    })

    return { ...data?.data, data: dataList, ...rest }
  },
}
