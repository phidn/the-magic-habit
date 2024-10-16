import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { TRoutes } from '@mazic/types'

export const homeRoute: TRoutes = [
  {
    path: pathRoutes.home,
    Component: lazy(() => import('./HomePage')),
  },
]
