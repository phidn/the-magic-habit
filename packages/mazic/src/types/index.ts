import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { ZodObject } from 'zod'
import { StateCreator } from 'zustand'

import { Icons } from '@mazic-design-system'

export interface NavItem {
  title: string
  href: string
  icon?: keyof typeof Icons
  childItems?: NavItem[]
}

export type SetStore<S> = (fn: (state: S) => void) => void

export type ImmerStateCreator<T> = StateCreator<T, [['zustand/immer', never], never], [], T>

type Role = 'User' | 'Admin'

export interface IUser {
  roles: Role[]
  id: string
  name: string
  email: string
  image: string
  createdAt: string
  updatedAt: string
}

export type MutationApiResponse = UseMutationResult<AxiosResponse<any, any>, Error, any, unknown>

export interface ITableColsProps {
  refreshTable?: () => void
}

export interface IPaginationApi {
  page: number
  pageSize: number
}

export interface IParams {
  page: number
  pageSize: number
  [key: string]: any
}

export interface PaginationPage {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  meta: {
    pagination: PaginationPage
  }
}

export interface IFormProps {
  initialValues?: any
  data?: any
  schema?: ZodObject<any>
  onSubmitForm: (values: any) => any
  isPendingSubmit?: boolean
}
