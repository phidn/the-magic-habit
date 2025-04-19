import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

export type HeatMapValue = {
  date: string
  content?: string | string[] | React.ReactNode
  count: number

  id: string
  column?: number
  row?: number
  index?: number
  level: number
  journal: string
  is_done?: boolean
  criterion_id?: string
  criterion_values?: {
    criterion_id: string
    value: number
  }[]
}

export type MutationApiResponse = UseMutationResult<AxiosResponse<any, any>, Error, any, unknown>

export interface ErrorResponse {
  success: boolean
  error?: {
    name: string
    code: number
    message: string
    details?: any
  }
}

export * from './habit'
export * from './role'
export * from './checkIn'
