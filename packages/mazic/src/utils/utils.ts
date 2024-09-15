import axios, { AxiosError } from 'axios'
import qs from 'qs'

import { CONFIG, HTTP_CODE } from '@mazic/config/config'

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export const isAxiosUnprocessableEntityError = <FormError>(
  error: unknown
): error is AxiosError<FormError> => {
  return isAxiosError(error) && error.response?.status === HTTP_CODE.UnprocessableEntity
}

const getElementY = (query: number | Element): number => {
  try {
    return typeof query === 'number' ? query : window.scrollY + query.getBoundingClientRect().top
  } catch (error) {
    return 0
  }
}

export const scrollTo = (
  selector: string,
  duration = 500,
  minus = 80
): Promise<number> | undefined => {
  try {
    const el = document.querySelector(selector)

    if (!el) {
      throw new Error(`No element matches the selector: ${selector}`)
    }

    return new Promise((resolve) => {
      const startingY = window.scrollY
      const elementY = getElementY(el) - minus

      const targetY =
        document.body.scrollHeight - elementY < window.innerHeight
          ? document.body.scrollHeight - window.innerHeight
          : elementY
      const diff = targetY - startingY
      const easing = (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      let start: number | undefined

      if (!diff) return resolve(1)

      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const time = timestamp - start
        let percent = Math.min(time / duration, 1)
        percent = easing(percent)
        window.scrollTo(0, startingY + diff * percent)

        if (time < duration) {
          window.requestAnimationFrame(step)
        } else {
          resolve(1)
        }
      }

      window.requestAnimationFrame(step)
    })
  } catch (error) {
    return undefined
  }
}

/**
 * Skip error message from recharts
 * https://github.com/recharts/recharts/issues/3615#issuecomment-1636923358
 */
export const skipError = (): void => {
  // eslint-disable-next-line no-console
  const error = console.error
  // eslint-disable-next-line no-console
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return
    error(...args)
  }
}

export const createQueryString = (params: Record<string, any>) => {
  for (const [key, value] of Object.entries(params)) {
    if (value === '' || value === null || value === undefined) {
      delete params[key]
    }
  }

  if (params?.page === CONFIG.pagination.page) {
    delete params.page
  }
  if (params?.pageSize === CONFIG.pagination.pageSize) {
    delete params.pageSize
  }
  if (!params.search) {
    delete params.search
  }

  return qs.stringify(params, {
    encode: false,
    strictNullHandling: true,
  })
}
