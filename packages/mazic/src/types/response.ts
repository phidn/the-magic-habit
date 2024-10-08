import { TUser } from '@mazic/modules/rbac/user'

export interface SuccessResponse<TData> {
  success: boolean
  data: TData
}

export interface ErrorResponse {
  success: boolean
  error?: {
    name: string
    code: number
    message: string
    details?: any
  }
}

export type AuthResponse = {
  access_token: string
  refresh_token: string
  user: TUser
}
