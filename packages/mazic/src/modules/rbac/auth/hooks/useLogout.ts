import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { useStore } from '@mazic/store/useStore'
import { deleteAllStorages } from '@mazic/utils/localStorage'

export const useLogout = () => {
  const navigate = useNavigate()
  const setOpenItem = useStore((state) => state.sidebar.setOpenItem)

  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOpenItem({ label: '', href: '' })
      return true
    },
    onSuccess: () => {
      deleteAllStorages()
      navigate('/login')
    },
  })
}
