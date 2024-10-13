import { lazy } from 'react'

export { checkInSchema, type THabitCheckIn } from './utils/validations'
export { useCheckIn, useDeleteCheckIn } from './hooks/apis'

export { FormCheckIn } from './components/FormCheckIn/FormCheckIn'
export { CheckInHeatmap } from './components/CheckInHeatmap/CheckInHeatmap'

export { checkInType, checkInMap, checkInOpts } from './utils/utils'

export const checkInPaths = {
  widget: '/widget/:api_key',
}

export const checkInRoute = [
  {
    path: checkInPaths.widget,
    Component: lazy(() => import('./CheckInPage')),
  },
]
