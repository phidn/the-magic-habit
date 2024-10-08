import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useStore } from '@mazic/store/useStore'
import { ApiResponse, IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { habitService } from '../services/habitService'
import { normalizeHabitData } from '../utils/utils'
import { THabit, THabitCreate } from '../utils/validations'

const QUERY_KEY = 'habits' as const

export const useHabitDetail = (habitId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => habitService.get<ApiResponse<THabit>>(habitId),
    queryKey: [QUERY_KEY, habitId, 'habits_detail'],
    enabled: !!habitId,
  })

  return { ...data?.data, ...rest }
}

export const useUpdateHabit = (habitId: string) => {
  return useMutation({
    mutationFn: (payload: THabit) => habitService.update(habitId, payload),
    onSuccess: () => toast.success('Successfully updated habit'),
  })
}

export const useCreateHabit = () => {
  return useMutation({
    mutationFn: (payload: THabitCreate) => habitService.create(payload),
    onSuccess: () => toast.success('Successfully created habit'),
  })
}

export const useDeleteHabit = () => {
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

export const useListHabit = (params?: IParams) => {
  const userId = useStore((state) => state.currentUser.user?.id)
  const { data, ...rest } = useQuery({
    queryFn: () => habitService.list<ApiResponse<THabit[]>>(params),
    queryKey: [QUERY_KEY, 'listHabits', params, userId],
  })

  const dataList = normalizeHabitData(data?.data?.data || [])
  return { ...data?.data, data: dataList, ...rest }
}
