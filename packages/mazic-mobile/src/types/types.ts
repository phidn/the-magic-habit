import { ZodEffects, ZodObject } from 'zod'
import { StateCreator } from 'zustand'

export type ImmerStateCreator<T> = StateCreator<T, [['zustand/immer', never], never], [], T>

// #region: Api Request Get list
export interface IParams {
  page?: number
  pageSize?: number
  enabled?: boolean
  [key: string]: any
}

// #endregion: Api Request Get list

// #region: API Response

export interface PaginationPage {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta: {
    pagination: PaginationPage
  }
}

export interface IAxiosResponse<T> {
  data: ApiResponse<T>
}

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

export interface TUser {
  id: string
  email: string
  name: string
  avatar: string
}

export type AuthResponse = {
  access_token: string
  refresh_token: string
  user: TUser
}

// #endregion: API Response

export interface IOption {
  label: string
  value: any
  code?: string
  enableCount?: boolean
  disabled?: boolean
  dropdownIcon?: React.JSX.Element
  inputIcon?: React.JSX.Element
  renderLabel?: () => React.ReactNode
  renderIcon?: () => React.ReactNode
  [key: string]: any
}

export interface IFormProps {
  title?: string
  initialValues?: any
  data?: any
  schema?: ZodObject<any> | ZodEffects<any, any>
  isPendingSubmit?: boolean

  onSubmitForm: (values: any) => any
  refreshData?: () => void
  onGoBack?: () => void
}
