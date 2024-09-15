import { lazy } from 'react'

const ActionListPage = lazy(() => import('./pages/ActionListPage'))
const ActionCreatePage = lazy(() => import('./pages/ActionCreatePage'))
const ActionUpdatePage = lazy(() => import('./pages/ActionUpdatePage'))

export const actionRoute = [
  {
    path: '/action',
    Component: ActionListPage,
  },
  {
    path: '/action/view/:id',
    Component: ActionUpdatePage,
  },
  {
    path: '/action/edit/:id',
    Component: ActionUpdatePage,
  },
  {
    path: '/action/new',
    Component: ActionCreatePage,
  },
]
