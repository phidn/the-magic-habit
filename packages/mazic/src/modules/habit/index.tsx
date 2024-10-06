import { lazy } from 'react'

const HabitListPage = lazy(() => import('./pages/HabitListPage'))
const HabitUpdatePage = lazy(() => import('./pages/HabitUpdatePage'))
const HabitCreatePage = lazy(() => import('./pages/HabitCreatePage'))

export const habitRoute = [
  {
    path: '/habit',
    Component: HabitListPage,
  },
  {
    path: '/habit/view/:id',
    Component: HabitUpdatePage,
  },
  {
    path: '/habit/edit/:id',
    Component: HabitUpdatePage,
  },
  {
    path: '/habit/new',
    Component: HabitCreatePage,
  },
]

export { THabit, THabitCheckIn, habitCheckInSchema } from './utils/validations'
export { checkInType } from './utils/utils'
export { useCheckIn, useDeleteCheckIn, useListHabit } from './hooks/apis'
