import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'
import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

const { habit: habitPaths } = pathRoutes

export const habitRoute: TRoutes = [
  {
    path: habitPaths.list,
    permission: PERMISSIONS.habit.view,
    Component: lazy(() => import('./pages/HabitListPage')),
  },
  {
    path: habitPaths.view,
    permission: PERMISSIONS.habit.view,
    Component: lazy(() => import('./pages/HabitUpdatePage')),
  },
  {
    path: habitPaths.edit,
    permission: PERMISSIONS.habit.update,
    Component: lazy(() => import('./pages/HabitUpdatePage')),
  },
  {
    path: habitPaths.create,
    permission: PERMISSIONS.habit.create,
    Component: lazy(() => import('./pages/HabitCreatePage')),
  },
]

export { habitSchema, TCheckIn, THabit } from './utils/validations'
