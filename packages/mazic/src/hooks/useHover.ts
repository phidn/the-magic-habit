import { useEffect, useRef, useState } from 'react'

export const useHover = <T extends HTMLElement>(): [React.RefObject<T>, boolean] => {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<T>(null)

  const handleMouseOver = () => setIsHovered(true)
  const handleMouseOut = () => setIsHovered(false)

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  return [ref, isHovered]
}
