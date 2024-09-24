import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { TMethods } from '@mazic/types/form'

export const useMethods = () => {
  const [isReady, setReady] = useState(false)
  const [methods, setMethods] = useState<TMethods>()
  const formContext = useFormContext()

  useEffect(() => {
    const checkMethods = async () => {
      while (isReady === false) {
        if (formContext && typeof formContext.getValues === 'function') {
          setReady(true)
          setMethods(formContext)
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    checkMethods()
  }, [formContext, isReady, methods])

  return {
    isReady,
    methods,
  }
}
