import { lazy } from 'react'

export const actionRoute = [
  {
    path: '/action',
    Component: lazy(() => import('./pages/ActionListPage')),
  },
  {
    path: '/action/view/:id',
    Component: lazy(() => import('./pages/ActionUpdatePage')),
  },
  {
    path: '/action/edit/:id',
    Component: lazy(() => import('./pages/ActionUpdatePage')),
  },
  {
    path: '/action/new',
    Component: lazy(() => import('./pages/ActionCreatePage')),
  },
]
