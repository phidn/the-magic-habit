import { lazy } from 'react'

export const resourceRoute = [
  {
    path: '/resource',
    Component: lazy(() => import('./pages/ResourceListPage')),
  },
  {
    path: '/resource/view/:id',
    Component: lazy(() => import('./pages/ResourceUpdatePage')),
  },
  {
    path: '/resource/edit/:id',
    Component: lazy(() => import('./pages/ResourceUpdatePage')),
  },
  {
    path: '/resource/new',
    Component: lazy(() => import('./pages/ResourceCreatePage')),
  },
]
