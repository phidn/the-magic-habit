import { useQuery } from '@tanstack/react-query'

import { useStore } from '@/store/useStore'
import { ApiResponse, IParams } from '@/types/types'
import http from '@/utils/http'

import { normalizeHabitData, THabit } from './utils'

const QUERY_KEY = 'habits' as const

export const useListHabitApi = (params?: IParams) => {
  const userId = useStore((state) => state.currentUser.user?.id)
  const { data, ...rest } = useQuery({
    queryFn: () => http.get<ApiResponse<THabit[]>>('/habits', { params }),
    queryKey: [QUERY_KEY, 'listHabits', params, userId],
  })

  const dataList = normalizeHabitData(data?.data?.data || [])
  return { ...data?.data, data: dataList, ...rest }
}
