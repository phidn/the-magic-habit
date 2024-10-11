import { Suspense, useEffect } from 'react'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ModalCommon } from '@mazic/components'
import { CONFIG } from '@mazic/config/config'
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

  useEffect(() => {
    if (CONFIG.isDevelopment) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/react-render-tracker'
      script.async = true
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster richColors visibleToasts={1} className="mb-16" />
      <RouterProvider router={routers} />
      <BrowserRouter>
        <ModalCommon />
      </BrowserRouter>
    </Suspense>
  )
}
