import { lazy } from 'react'

import { PATH_ROUTE } from '@mazic/config/config'

export { checkInSchema, type THabitCheckIn } from './utils/validations'
export { useCheckIn, useDeleteCheckIn } from './hooks/apis'

export { FormCheckIn } from './components/FormCheckIn/FormCheckIn'
export { CheckInHeatmap } from './components/CheckInHeatmap/CheckInHeatmap'

export { checkInType, checkInMap, checkInOpts } from './utils/utils'

export const checkInRoute = [
  {
    path: PATH_ROUTE.widget,
    Component: lazy(() => import('./CheckInPage')),
  },
]
