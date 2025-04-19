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

export const arrayMoveMutate = <T>(array: T[], from: number, to: number): void => {
  const startIndex = from < 0 ? array.length + from : from

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = to < 0 ? array.length + to : to

    const [item] = array.splice(from, 1)
    array.splice(endIndex, 0, item)
  }
}

export const arrayMove = <T>(array: T[], from: number, to: number): T[] => {
  array = [...array]
  arrayMoveMutate(array, from, to)
  return array
}

export function hslToHex(hsl: string): string {
  // parse “hsl(240,100%,50%)”
  const [h, sPct, lPct] = hsl.match(/[\d.]+/g)!.map(Number)
  const hNorm = (h % 360) / 360
  const s = sPct / 100
  const l = lPct / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, hNorm + 1 / 3)
    g = hue2rgb(p, q, hNorm)
    b = hue2rgb(p, q, hNorm - 1 / 3)
  }

  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function lightenHexColor(hex: string, percent = 30): string {
  hex = hex.replace(/^#/, '')
  const num = parseInt(hex, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))
  const toHex = (c: number) => c.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
