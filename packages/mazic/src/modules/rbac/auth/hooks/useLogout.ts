import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { deleteAllStorages } from '@mazic/utils/localStorage'

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    },
    onSuccess: () => {
      deleteAllStorages()
      navigate('/login')
    },
  })
}
