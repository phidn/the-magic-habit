import { useEffect, useRef, useState } from 'react'

export const LoadingTop = () => {
  const [currentProgress, setCurrentProgress] = useState(0)
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const itv = setInterval(() => {
      setCurrentProgress((prevProgress) => {
        let newProgress = prevProgress + Math.random() * 40
        if (newProgress > 100) newProgress = 100
        if (newProgress === 100) clearInterval(itv)
        return newProgress
      })
    }, 800)
    return () => clearInterval(itv)
  }, [])

  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.style.width = `${currentProgress}%`
    }
  }, [currentProgress])

  return (
    <div
      ref={loadingRef}
      className="loading h-1 w-[0%] bg-primary transition-all duration-200"
    ></div>
  )
}
