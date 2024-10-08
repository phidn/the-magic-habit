import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const resourceRoute: TRoutes = [
  {
    path: '/resource',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceListPage')),
  },
  {
    path: '/resource/view/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceUpdatePage')),
  },
  {
    path: '/resource/edit/:id',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceUpdatePage')),
  },
  {
    path: '/resource/new',
    permission: permissionsConfig.administration.all_actions,
    Component: lazy(() => import('./pages/ResourceCreatePage')),
  },
]
