import * as React from 'react'

import { cn } from '@ui/utils'

import { Spinner } from '../../../components/spinner'

export const ImageOverlay = React.memo(() => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-center',
        'absolute inset-0 rounded bg-[var(--mt-overlay)] opacity-100 transition-opacity'
      )}
    >
      <Spinner className="size-7" />
    </div>
  )
})

ImageOverlay.displayName = 'ImageOverlay'
