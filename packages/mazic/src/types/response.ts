import { IUser } from '@mazic/types'

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

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expires: string
  user: IUser
}>
