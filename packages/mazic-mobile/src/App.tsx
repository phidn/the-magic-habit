import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppLayout } from './layouts/AppLayout/AppLayout'
import { i18nInstance } from './utils/language'
import { skipError } from './utils/utils'

skipError()

if (__DEV__) {
  require('./config/reactotronConfig')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

const App = () => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <QueryClientProvider client={queryClient}>
        <AppLayout />
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default App
