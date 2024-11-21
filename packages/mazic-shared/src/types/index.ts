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
