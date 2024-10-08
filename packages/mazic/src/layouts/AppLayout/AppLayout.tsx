import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@mazic/ui'

import { ModalCommon } from '@mazic/components'
import { routers } from '@mazic/routers/routers'
import { authService } from '@mazic/services/authService'
import { useStore } from '@mazic/store/useStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

export const AppLayout = () => {
  const theme = useStore((state) => state.theme.mode)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme || 'light')
  }, [theme])

  const setCurrentUser = useStore((store) => store.setCurrentUser)

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
  }, [setCurrentUser])

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors visibleToasts={1} className="mb-16" />
      <Suspense fallback={<div>Loading...</div>}>
        <TooltipProvider delayDuration={300}>
          <RouterProvider router={routers} />
          <ModalCommon />
        </TooltipProvider>
      </Suspense>
    </QueryClientProvider>
  )
}
