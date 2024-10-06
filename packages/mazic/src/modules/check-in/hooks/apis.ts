import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { checkInService } from '../services/checkInService'
import { THabitCheckIn } from '../utils/validations'

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
