import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getActivities, THabit } from '@mazic/modules/habit'
import { ApiResponse } from '@mazic/types'

import { checkInService } from '../services/checkInService'
import { THabitCheckIn } from '../utils/validations'

const QUERY_KEY = 'check_in' as const

export const useCheckIn = () => {
  return useMutation({
    mutationFn: (payload: THabitCheckIn) => checkInService.checkIn(payload),
    onSuccess: () => toast.success('Successfully checked-in'),
  })
}

export const useDeleteCheckIn = () => {
  return useMutation({
    mutationFn: (checkInId: string) => checkInService.deleteCheckIn(checkInId),
    onSuccess: () => toast.success('Successfully deleted check-in'),
  })
}

export const useFindWidget = (apiKey: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => checkInService.findWidget<ApiResponse<THabit>>(apiKey),
    queryKey: [QUERY_KEY, 'listHabits', apiKey],
  })

  const _data = data?.data?.data
  if (_data) {
    _data.activities = getActivities(data?.data?.data?.check_in_items)
  }
  return { ...data?.data, data: _data, ...rest }
}
