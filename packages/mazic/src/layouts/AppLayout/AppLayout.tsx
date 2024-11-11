import { Suspense, useEffect } from 'react'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { LoadingTop, ModalCommon } from '@mazic/components'
import { pathRoutes } from '@mazic/config/pathRoutes'
import { AppContextProvider } from '@mazic/hooks/useAppContext'
import { authService } from '@mazic/modules/rbac/auth'
import { routers } from '@mazic/routers/routers'
import { useStoreShallow } from '@mazic/store/useStore'

export const AppLayout = () => {
  const [theme, setCurrentUser, { user, loaded }] = useStoreShallow((state) => [
    state.theme.mode,
    state.setCurrentUser,
    state.currentUser,
    state.modal.open,
  ])
  const authRoutes = Object.values(pathRoutes.auth)
  const isPublicRoute = authRoutes.some((route) => window.location.pathname.includes(route))

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme || 'light')
  }, [theme])

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await authService.getMe()
        setCurrentUser(data.data)
      } catch (error) {
        setCurrentUser(undefined)
      }
    }
    if (!isPublicRoute && !loaded) {
      getCurrentUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublicRoute, loaded, user])

  return (
    <AppContextProvider>
      <Suspense fallback={<LoadingTop />}>
        <Toaster richColors visibleToasts={1} className="mb-16" />
        <RouterProvider router={routers} />
        <BrowserRouter>
          <ModalCommon />
        </BrowserRouter>
      </Suspense>
    </AppContextProvider>
  )
}
