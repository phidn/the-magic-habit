import { useCallback, useEffect, useRef, useState } from 'react'

interface Rect {
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
  x: number
  y: number
}

const useRect = <T extends HTMLElement>(): [React.RefObject<T>, Rect | null] => {
  const ref = useRef<T>(null)
  const [rect, setRect] = useState<Rect | null>(null)

  const updateRect = useCallback(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect())
    }
  }, [])

  useEffect(() => {
    updateRect() // Cập nhật rect khi component mount lần đầu tiên

    const resizeObserver = new ResizeObserver(() => {
      updateRect()
    })

    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateRect])

  return [ref, rect]
}

export default useRect
