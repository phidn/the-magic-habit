import { Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AlertDialogCommon } from '@mazic/components/Commons/AlertCommon'

import './utils/i18n'

import { ThemeProvider } from './contexts/ThemeProvider'
import { routers } from './routers/routers'

import './styles/mazic.scss'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

// TODO: Add page lazy loading
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Toaster richColors />
      <AlertDialogCommon />
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={routers} />
      </Suspense>
    </ThemeProvider>
  </QueryClientProvider>
)
