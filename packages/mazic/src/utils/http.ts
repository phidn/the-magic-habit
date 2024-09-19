import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { CONFIG, HTTP_CODE, PATH_API } from '@mazic/config/config'
import { AuthResponse } from '@mazic/types/response'

import { clearLS, getTokens, setProfileToLS, setTokensToLS } from './localStorage'

const AXIOS_OPTIONS = {
  baseURL: CONFIG.apiURL,
  timeout: 5 * 1000 * 60, // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
}

const UNAUTHORIZED_PATHS = [PATH_API.login, PATH_API.refreshToken, PATH_API.register]

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private isRefreshing: boolean

  constructor(options: AxiosRequestConfig) {
    const tokens = getTokens()
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
    this.isRefreshing = false
    this.instance = axios.create(options)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        if (
          this.accessToken &&
          config.headers &&
          UNAUTHORIZED_PATHS.every((path) => !config.url?.includes(path))
        ) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(this.handleResponse, this.handleError)
  }

  private handleResponse = (response: any) => {
    const { url } = response.config
    if (url.includes(PATH_API.login) || url.includes(PATH_API.register)) {
      const { tokens, user } = response.data as AuthResponse
      this.setTokens(tokens.access_token, tokens.refresh_token)
      setProfileToLS(user)
    } else if (url.includes(PATH_API.logout)) {
      this.accessToken = ''
      clearLS()
    }
    return response
  }

  private handleError = (error: any) => {
    const _error = error?.response?.data || error?.response || error || {}
    switch (error.response.status) {
      case HTTP_CODE.Unauthorized:
        return this.tryRefreshToken(error)
      default:
        return Promise.reject(_error)
    }
  }

  private tryRefreshToken = async (error: any) => {
    if (this.refreshToken && !this.isRefreshing) {
      this.isRefreshing = true
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        const response = await this.instance.post(PATH_API.refreshToken, {
          access_token: this.accessToken,
          refresh_token: this.refreshToken,
        })
        const { tokens } = response.data
        this.setTokens(tokens.access_token, tokens.refresh_token)
        return this.instance(error.config)
      } catch (error) {
        clearLS()
        return Promise.reject(error)
      } finally {
        this.isRefreshing = false
      }
    } else if (this.isRefreshing) {
      /**
       * Wait for refreshToken to finish, then retry the original request
       * Check every 200ms if refreshToken is done
       */
      return new Promise((resolve) => {
        const intervalId = setInterval(() => {
          if (!this.isRefreshing) {
            clearInterval(intervalId)
            resolve(this.instance(error.config))
          }
        }, 200)
      })
    } else {
      clearLS()
      return Promise.reject(error)
    }
  }

  private setTokens = (access_token: string, refresh_token: string) => {
    this.accessToken = access_token
    this.refreshToken = refresh_token
    setTokensToLS(access_token, refresh_token)
  }

  async get<T = any>(url: string): Promise<T> {
    const response = await this.instance.get<T>(url)
    return response.data
  }
  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.post<T>(url, data).then((response) => response.data)
  }
  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.put<T>(url, data).then((response) => response.data)
  }
  async delete<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.delete<T>(url, data).then((response) => response.data)
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

const http = new Http(AXIOS_OPTIONS).instance

export default http
