import { ReactNode, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingTop } from '@mazic/components'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { useStore } from '@mazic/store/useStore'

import { MainLayout } from '../MainLayout'

type Props = {
  children: ReactNode
  permission?: string | string[]
}

export const ProtectedLayout = ({ children, permission }: Props) => {
  const navigate = useNavigate()
  const { user, loaded } = useStore((store) => store.currentUser)

  useEffect(() => {
    if (loaded && !user?.id) {
      navigate(pathRoutes.auth.login)
      return
    }
    if (loaded) {
      const perms = Array.isArray(permission) ? permission : [permission]
      const _perms = (perms || []).filter(Boolean) as string[]
      if (_perms?.length) {
        const userPerms = (user?.permissions || []).map((x) => x.code)
        const hasPermission = _perms.every((perm) => userPerms.includes(perm))
        if (!hasPermission) {
          navigate('/403')
        }
      }
    }
  }, [navigate, user, loaded, permission])

  return user?.id ? (
    <MainLayout>
      <Suspense fallback={<LoadingTop />}>{children}</Suspense>
    </MainLayout>
  ) : null
}
