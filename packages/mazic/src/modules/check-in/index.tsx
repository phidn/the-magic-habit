import { lazy } from 'react'

import { pathRoutes } from '@mazic/config/pathRoutes'

export { useCheckIn, useDeleteCheckIn } from './hooks/useCheckInApis'

export { FormCheckIn } from './components/FormCheckIn/FormCheckIn'
export { CheckInHeatmap } from './components/CheckInHeatmap/CheckInHeatmap'

export { checkInMap, checkInOpts } from './utils/utils'

const { checkIn: checkInPaths } = pathRoutes

export const checkInRoute = [
  {
    path: checkInPaths.widget,
    Component: lazy(() => import('./CheckInPage')),
  },
]
