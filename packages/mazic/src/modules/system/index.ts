import { lazy } from 'react'

import { TRoutes } from '@mazic/types'

export const systemRoute: TRoutes = [
  {
    path: '/403',
    Component: lazy(() => import('./UnauthorizedPage')),
  },
]
