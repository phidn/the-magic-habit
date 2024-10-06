import { lazy } from 'react'

export const habitRoute = [
  {
    path: '/habit',
    Component: lazy(() => import('./pages/HabitListPage')),
  },
  {
    path: '/habit/view/:id',
    Component: lazy(() => import('./pages/HabitUpdatePage')),
  },
  {
    path: '/habit/edit/:id',
    Component: lazy(() => import('./pages/HabitUpdatePage')),
  },
  {
    path: '/habit/new',
    Component: lazy(() => import('./pages/HabitCreatePage')),
  },
]

export { type THabit } from './utils/validations'
export { useListHabit } from './hooks/apis'
