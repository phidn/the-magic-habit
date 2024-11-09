import { useEffect, useState } from 'react'

function useIsReady(...params: any[]) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isReady) {
      const result = params.every(Boolean)
      if (result) {
        setIsReady(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return isReady
}

export default useIsReady
