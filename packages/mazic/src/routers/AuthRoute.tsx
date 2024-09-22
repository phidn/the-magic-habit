import { ReactNode, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { MainLayout } from '@mazic/layouts/MainLayout'
import { authService } from '@mazic/services/authService'
import { useStore } from '@mazic/store/useStore'

type Props = {
  children: ReactNode
}

const AuthRoute = ({ children }: Props) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const { setCurrentUser } = useStore()

  const getMeMutation = useMutation({
    mutationFn: () => authService.getMe(),
    onSuccess: ({ data }) => {
      setCurrentUser(data.data)
      setIsAuthenticated(true)
    },
    onError: () => {
      setIsAuthenticated(false)
      navigate('/login')
    },
  })

  useEffect(() => {
    getMeMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isAuthenticated ? (
    <MainLayout title="dashboard">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </MainLayout>
  ) : null
}

export default AuthRoute
