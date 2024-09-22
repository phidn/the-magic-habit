import dayjs from 'dayjs'

import { CONFIG } from '@mazic/config/config'
import { IUser } from '@mazic/types'

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}
export const setTokensToLS = (access_token: string, refresh_token: string) => {
  setAccessTokenToLS(access_token)
  setRefreshTokenToLS(refresh_token)
}

export const localStorageEventTarget = new EventTarget()

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('APP_STORAGE')

  const clearLSEvent = new Event('clearLS')
  localStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''
export const getTokens = () => ({
  accessToken: getAccessTokenFromLS(),
  refreshToken: getRefreshTokenFromLS(),
})

export const deleteAllStorages = () => {
  localStorage.clear()
  return localStorage.setItem('today', dayjs(new Date()).format(CONFIG.TIME.DD_MM_YYYY))
}
