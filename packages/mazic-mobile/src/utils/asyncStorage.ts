import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'

import { CONFIG, storageKeys } from '@/config/config'

export const setAccessToken = (access_token: string) => {
  AsyncStorage.setItem(storageKeys.token.accessToken, access_token)
}

export const setRefreshToken = (refresh_token: string) => {
  AsyncStorage.setItem(storageKeys.token.refreshToken, refresh_token)
}

export const setTokens = (access_token: string, refresh_token: string) => {
  setAccessToken(access_token)
  setRefreshToken(refresh_token)
}

export const getAccessToken = async (): Promise<string> => {
  const result = await AsyncStorage.getItem(storageKeys.token.accessToken)
  return result || ''
}

export const getRefreshToken = async (): Promise<string> => {
  const result = await AsyncStorage.getItem(storageKeys.token.refreshToken)
  return result || ''
}

export const getTokens = async () => {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()
  return { accessToken, refreshToken }
}

export const clearStorage = async () => {
  await AsyncStorage.clear()
  await AsyncStorage.setItem('today', dayjs(new Date()).format(CONFIG.TIME.DD_MM_YYYY))
  debugStorage()
}

export const debugStorage = () => {
  AsyncStorage.getAllKeys().then((keys) => {
    AsyncStorage.multiGet(keys).then((result) => {
      console.log('Storage:', result)
    })
  })
}
