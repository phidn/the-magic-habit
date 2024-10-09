import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './utils/i18n'

import { AppLayout } from './layouts/AppLayout/AppLayout'

import './styles/mazic.scss'
import './styles/tailwind.css'
import './styles/theme.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// TODO: Add page lazy loading
root.render(
  <QueryClientProvider client={queryClient}>
    <AppLayout />
  </QueryClientProvider>
)
