import { lazy } from 'react'

export * from './forms/DetailForm'
export * from './hooks/useCloseReasonApis'
export * from './hooks/useCloseReasonColumns'
export * from './schemas/closeReasonSchema'
export * from './services/closeReasonService'

const CloseReasonListPage = lazy(() => import('./pages/CloseReasonListPage'))
const CloseReasonCreatePage = lazy(() => import('./pages/CloseReasonCreatePage'))
const CloseReasonUpdatePage = lazy(() => import('./pages/CloseReasonUpdatePage'))

export const closeReasonRoute = [
  {
    path: '/close-reason',
    Component: CloseReasonListPage,
  },
  {
    path: '/close-reason/view/:id',
    Component: CloseReasonUpdatePage,
  },
  {
    path: '/close-reason/edit/:id',
    Component: CloseReasonUpdatePage,
  },
  {
    path: '/close-reason/new',
    Component: CloseReasonCreatePage,
  },
]
