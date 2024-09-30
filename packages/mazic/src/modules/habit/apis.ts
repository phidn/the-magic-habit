import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { toast } from 'sonner'

import { ApiResponse, IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { habitService } from './services'
import { THabit, THabitCreate } from './validations'

const QUERY_KEY = 'habits' as const

const useHabitDetail = (habitId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => habitService.get<ApiResponse<THabit>>(habitId),
    queryKey: [QUERY_KEY, habitId, 'habits_detail'],
    enabled: !!habitId,
  })

  return { ...data?.data, ...rest }
}

const useUpdateHabit = (habitId: string) => {
  return useMutation({
    mutationFn: (payload: THabit) => habitService.update(habitId, payload),
    onSuccess: () => toast.success('Successfully updated habit'),
  })
}

const useCreateHabit = () => {
  return useMutation({
    mutationFn: (payload: THabitCreate) => habitService.create(payload),
    onSuccess: () => toast.success('Successfully created habit'),
  })
}

const useDeleteHabit = () => {
  return useMutation({
    mutationFn: (habitId: string) => habitService.delete(habitId),
    onSuccess: () => {
      toast.success('Successfully deleted habit')
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete habit')
    },
  })
}

export const habitApis = {
  useList: (params?: IParams) => {
    const { data, ...rest } = useQuery({
      queryFn: () => habitService.list<ApiResponse<THabit[]>>(params),
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
  create: useCreateHabit,
  detail: useHabitDetail,
  update: useUpdateHabit,
  delete: useDeleteHabit,
}
