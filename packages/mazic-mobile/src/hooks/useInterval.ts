import { useEffect, useRef } from 'react'
/**
 * Provides a declarative useInterval
 *
 * @param callback - Function that will be called every `delay` ms.
 * @param delay - Number representing the delay in ms. Set to `null` to "pause" the interval.
 */
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallbackRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    savedCallbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handler = () => savedCallbackRef.current?.()
    if (delay !== null) {
      const intervalId = setInterval(handler, delay)
      return () => clearInterval(intervalId)
    }
  }, [delay])
}
export default useInterval
