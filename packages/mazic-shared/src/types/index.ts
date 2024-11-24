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
}

export * from './habit'
export * from './role'

export type MutationApiResponse = UseMutationResult<AxiosResponse<any, any>, Error, any, unknown>
