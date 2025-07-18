import { LazyExoticComponent } from 'react'
import { ZodEffects, ZodObject } from 'zod'
import { StateCreator } from 'zustand'

import { Icons } from '@mazic/ui'

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

export interface ITableColsProps {
  refreshTable?: () => void
}

export interface IPaginationApi {
  page: number
  pageSize: number
}

export interface IParams {
  page?: number
  pageSize?: number
  enabled?: boolean
  [key: string]: any
}

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

export interface IFormProps {
  title?: string | React.ReactNode
  initialValues?: any
  data?: any
  schema?: ZodObject<any> | ZodEffects<any, any>
  onSubmitForm: (values: any) => any
  isPendingSubmit?: boolean
}

export type TObjectAny = {
  [key: string]: any
}

export type TWithLoaded<T> = T & { loaded: boolean }

export interface IRoute {
  path: string
  permission?: string | string[]
  Component: LazyExoticComponent<() => JSX.Element>
}

export type TRoutes = IRoute[]
