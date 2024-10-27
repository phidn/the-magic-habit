import { ReactNode, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingTop } from '@mazic/components'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { useStore } from '@mazic/store/useStore'

type Props = {
  children: ReactNode
}

export const PublicLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  const { user, loaded } = useStore((store) => store.currentUser)

  useEffect(() => {
    if (loaded && user?.id) {
      navigate(pathRoutes.dashboard)
      return
    }
  }, [navigate, user, loaded])

  return user?.id ? <Suspense fallback={<LoadingTop />}>{children}</Suspense> : null
}
