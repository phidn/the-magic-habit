import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ModalCommon } from '@mazic/components'
import { routers } from '@mazic/routers/routers'
import { authService } from '@mazic/services/authService'
import { useStoreShallow } from '@mazic/store/useStore'

export const AppLayout = () => {
  const [theme, setCurrentUser] = useStoreShallow((state) => [
    state.theme.mode,
    state.setCurrentUser,
  ])

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
    getCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster richColors visibleToasts={1} className="mb-16" />
      <RouterProvider router={routers} />
      <ModalCommon />
    </Suspense>
  )
}
