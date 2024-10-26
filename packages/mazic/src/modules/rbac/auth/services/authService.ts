import { TLogin, TRegister } from '@mazic/modules/rbac/auth'
import { TResetPassword } from '@mazic/modules/rbac/auth/schemas'
import { TUser } from '@mazic/modules/rbac/user/schemas/userSchema'
import { IAxiosResponse } from '@mazic/types'
import { AuthResponse } from '@mazic/types/response'
import http from '@mazic/utils/http'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@mazic/utils/localStorage'

interface IAuthService {
  login: (body: TLogin) => Promise<IAxiosResponse<AuthResponse>>
  register: (body: TRegister) => Promise<IAxiosResponse<AuthResponse>>
  logout: () => Promise<IAxiosResponse<any>>
  getMe: () => Promise<IAxiosResponse<TUser>>
  refreshToken: () => Promise<IAxiosResponse<any>>
  resendEmail: (email: string) => Promise<IAxiosResponse<any>>
  forgotPassword: (email: string) => Promise<IAxiosResponse<any>>
  resetPassword: (payload: TResetPassword) => Promise<IAxiosResponse<any>>
  verifyCode: (code: string) => Promise<IAxiosResponse<{ email: string }>>
  verifyForgotCode: (code: string) => Promise<IAxiosResponse<{ email: string }>>
}

export const authService: IAuthService = {
  login: (body) => http.post('/auth/login', body),
  register: (body) => http.post('/auth/register', body),
  logout: () => {
    const access_token = getAccessTokenFromLS()
    const refresh_token = getRefreshTokenFromLS()
    return http.post('/auth/logout', { access_token, refresh_token })
  },
  getMe: () => http.get('/auth/me'),
  refreshToken: () => {
    const refresh_token = getRefreshTokenFromLS()
    return http.post('/auth/refresh-token', { refresh_token })
  },
  resendEmail: (email) => http.post('/auth/resend-email', { email }),
  forgotPassword: (email) => http.post('/auth/forgot-password', { email }),
  resetPassword: ({ password, code }) => http.post('/auth/reset-password', { password, code }),
  verifyCode: (code) => http.post('/auth/verify-code', { code }),
  verifyForgotCode: (code) => http.post('/auth/verify-forgot-code', { code }),
}
