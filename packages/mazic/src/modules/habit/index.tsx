import { lazy } from 'react'

import { permissionsConfig } from '@mazic/shared'

import { TRoutes } from '@mazic/types'

export const habitRoute: TRoutes = [
  {
    path: '/habit',
    permission: permissionsConfig.habit.view,
    Component: lazy(() => import('./pages/HabitListPage')),
  },
  {
    path: '/habit/view/:id',
    permission: permissionsConfig.habit.view,
    Component: lazy(() => import('./pages/HabitUpdatePage')),
  },
  {
    path: '/habit/edit/:id',
    permission: permissionsConfig.habit.update,
    Component: lazy(() => import('./pages/HabitUpdatePage')),
  },
  {
    path: '/habit/new',
    permission: permissionsConfig.habit.create,
    Component: lazy(() => import('./pages/HabitCreatePage')),
  },
]

export { type THabit, type TCheckIn } from './utils/validations'
export { getActivities } from './utils/utils'

export { useListHabit } from './hooks/apis'
