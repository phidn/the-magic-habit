import { AxiosResponse } from 'axios'

import { LoginSchemaType } from '@mazic/modules/rbac/auth'
import { TUser } from '@mazic/modules/rbac/user/schemas/userSchema'
import http from '@mazic/utils/http'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@mazic/utils/localStorage'

export const authService = {
  login: <T = any>(body: LoginSchemaType) => http.post<T>('/auth/login', body),
  logout: () => {
    const access_token = getAccessTokenFromLS()
    const refresh_token = getRefreshTokenFromLS()
    return http.post<any>('/auth/logout', { access_token, refresh_token })
  },
  getMe: () => http.get<AxiosResponse<TUser>>('/auth/me'),
}
