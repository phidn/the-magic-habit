import { ReactNode, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { MainLayout } from '@mazic/layouts/MainLayout'
import { useStore } from '@mazic/store/useStore'

type Props = {
  children: ReactNode
}

const AuthRoute = ({ children }: Props) => {
  const navigate = useNavigate()
  const currentUser = useStore((store) => store.currentUser)

  useEffect(() => {
    if (currentUser.loaded && !currentUser.user?.id) {
      navigate('/login')
    }
  }, [currentUser, navigate])

  return currentUser.user?.id ? (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </MainLayout>
  ) : null
}

export default AuthRoute
