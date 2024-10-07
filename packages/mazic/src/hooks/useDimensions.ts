import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react'

type DOMRectRef = [rect: DOMRect, ref: RefObject<any>]

export const useDimensions = (): DOMRectRef => {
  const ref = useRef<any>(null)

  const [rect, setRect] = useState<DOMRect>(DOMRect.fromRect())

  const resizeObserver = useMemo(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setRect(entry.contentRect)
      }
    })

    observer.observe(ref.current)

    return observer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  useLayoutEffect(
    () => () => {
      if (ref.current) {
        resizeObserver?.unobserve(ref.current)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resizeObserver, ref.current]
  )

  return [rect, ref]
}
