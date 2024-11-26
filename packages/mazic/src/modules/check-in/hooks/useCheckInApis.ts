import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { THabitCheckIn } from '@mazic/shared'
import { useAppContext } from '@mazic/hooks'

import { checkInService } from '../services/checkInService'

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
  const { utils } = useAppContext()
  const { data, ...rest } = useQuery({
    queryFn: () => checkInService.findWidget(apiKey),
    queryKey: [QUERY_KEY, 'listHabits', apiKey],
  })

  const _data = data?.data?.data
  if (_data) {
    _data.activities = utils.getActivities(data?.data?.data?.check_in_items)
  }
  return { ...data?.data, data: _data, ...rest }
}
