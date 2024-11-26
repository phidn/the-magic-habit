import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner-native'

import { ErrorResponse, THabit, THabitCheckIn, THabitCreate } from '@mazic/shared'

import { useStore } from '@/store/useStore'
import { ApiResponse, IParams } from '@/types/types'
import http from '@/utils/http'

import { normalizeHabitData } from './utils'

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

export const useHabitDetail = (habitId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => http.get<ApiResponse<THabit>>('/habits/' + habitId),
    queryKey: [QUERY_KEY, habitId, 'habits_detail'],
    enabled: !!habitId,
  })

  return { ...data?.data, ...rest }
}

export const useUpdateHabit = (habitId: string) => {
  return useMutation({
    mutationFn: (payload: THabit) => http.put<ApiResponse<THabit>>('/habits/' + habitId, payload),
    onSuccess: () => toast.success('Successfully updated habit'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to update habit')
    },
  })
}

export const useCreateHabit = () => {
  return useMutation({
    mutationFn: (payload: THabitCreate) => http.post<ApiResponse<THabit>>('/habits', payload),
    onSuccess: () => toast.success('Successfully created habit'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to create habit')
    },
  })
}

export const useCheckIn = () => {
  return useMutation({
    mutationFn: (payload: THabitCheckIn) => http.post<ApiResponse<THabit>>('/check-in', payload),
    onSuccess: () => toast.success('Successfully checked-in'),
  })
}

export const useDeleteCheckIn = () => {
  return useMutation({
    mutationFn: (id: string) => http.delete<ApiResponse<THabit>>('/check-in/' + id),
    onSuccess: () => toast.success('Successfully deleted check-in'),
  })
}
