import { lazy } from 'react'

const ResourceListPage = lazy(() => import('./pages/ResourceListPage'))
const ResourceCreatePage = lazy(() => import('./pages/ResourceCreatePage'))
const ResourceUpdatePage = lazy(() => import('./pages/ResourceUpdatePage'))

export const resourceRoute = [
  {
    path: '/resource',
    Component: ResourceListPage,
  },
  {
    path: '/resource/view/:id',
    Component: ResourceUpdatePage,
  },
  {
    path: '/resource/edit/:id',
    Component: ResourceUpdatePage,
  },
  {
    path: '/resource/new',
    Component: ResourceCreatePage,
  },
]
