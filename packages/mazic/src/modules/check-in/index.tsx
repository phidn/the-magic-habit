import { lazy } from 'react'

export { checkInSchema, type THabitCheckIn } from './utils/validations'
export { useCheckIn, useDeleteCheckIn } from './hooks/apis'

export { FormCheckIn } from './components/FormCheckIn/FormCheckIn'
export { CheckHeatmap } from './components/CheckHeatmap/CheckHeatmap'

export { checkInType, checkInMap, checkInOpts } from './utils/utils'

export const dashboardRoute = [
  {
    path: '/',
    Component: lazy(() => import('./CheckInPage')),
  },
]
