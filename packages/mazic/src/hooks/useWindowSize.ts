import { useState } from 'react'

import { useDebounce } from './useDebounce'
import { useEventListener } from './useEventListener'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type WindowSize<T extends number | undefined = number | undefined> = {
  width: T
  height: T
}

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue
  debounceDelay?: number
}

const IS_SERVER = typeof window === 'undefined'

export const useWindowSize = (
  options: Partial<UseWindowSizeOptions<boolean>> = {}
): WindowSize | WindowSize<number> => {
  let { initializeWithValue = true } = options
  if (IS_SERVER) {
    initializeWithValue = false
  }

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (initializeWithValue) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }
    return {
      width: undefined,
      height: undefined,
    }
  })

  const debouncedSetWindowSize = useDebounce(setWindowSize, options.debounceDelay)

  function handleSize() {
    const setSize = options.debounceDelay ? debouncedSetWindowSize : setWindowSize

    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener('resize', handleSize)

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize()
  }, [])

  return windowSize
}
