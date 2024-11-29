import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { useStoreShallow } from '@mazic/store/useStore'
import { deleteAllStorages } from '@mazic/utils/localStorage'

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [setOpenItem, setCurrentUser] = useStoreShallow((state) => [
    state.sidebar.setOpenItem,
    state.setCurrentUser,
  ])

  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOpenItem({ label: '', href: '' })
      setCurrentUser(undefined)
      return true
    },
    onSuccess: () => {
      queryClient.clear()
      deleteAllStorages()
      navigate(pathRoutes.auth.login)
    },
  })
}
