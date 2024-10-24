import { AxiosResponse } from 'axios'

import { TLogin, TRegister } from '@mazic/modules/rbac/auth'
import { TUser } from '@mazic/modules/rbac/user/schemas/userSchema'
import http from '@mazic/utils/http'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@mazic/utils/localStorage'

export const authService = {
  login: <T = any>(body: TLogin) => http.post<T>('/auth/login', body),
  register: <T = any>(body: TRegister) => http.post<T>('/auth/register', body),
  logout: () => {
    const access_token = getAccessTokenFromLS()
    const refresh_token = getRefreshTokenFromLS()
    return http.post<any>('/auth/logout', { access_token, refresh_token })
  },
  getMe: () => http.get<AxiosResponse<TUser>>('/auth/me'),
  resendEmail: (email: string) => http.post('/auth/resend-email', { email }),
  verifyCode: <T = any>(code: string) => http.post<AxiosResponse<T>>('/auth/verify-code', { code }),
}
