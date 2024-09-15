import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { authService } from '@mazic/services/authService'
import { deleteAllStorages } from '@mazic/utils/localStorage'

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      deleteAllStorages()
      navigate('/login')
    },
  })
}
