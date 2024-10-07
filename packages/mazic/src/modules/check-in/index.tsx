import { lazy } from 'react'

export { checkInSchema, type THabitCheckIn } from './utils/validations'
export { useCheckIn, useDeleteCheckIn } from './hooks/apis'

export { FormCheckIn } from './components/FormCheckIn/FormCheckIn'
export { CheckInHeatmap } from './components/CheckInHeatmap/CheckInHeatmap'

export { checkInType, checkInMap, checkInOpts } from './utils/utils'

export const checkInRoute = [
  {
    path: '/check-in/:api_key',
    Component: lazy(() => import('./CheckInPage')),
  },
]
