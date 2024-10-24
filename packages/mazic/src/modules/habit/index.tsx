import { lazy } from 'react'

import { PERMISSIONS } from '@mazic/config/permissions'
import { TRoutes } from '@mazic/types'

export const habitPaths = {
  list: '/habit',
  view: '/habit/view/:id',
  edit: '/habit/edit/:id',
  create: '/habit/create',
}

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

export { type THabit, type TCheckIn } from './utils/validations'
export { getActivities } from './utils/utils'

export { useListHabit, useDeleteHabit } from './hooks/apis'
