import { ColumnDef } from '@tanstack/react-table'

import { IOption } from './form'

export interface DataTableFilterField {
  title?: string
  // label?: string
  filterKey: string
  placeholder?: string
  options: IOption[]
  multiSelect?: boolean

  // TODO: update typescript
  typeValue?: string
  selectedValue?: any
  onChange?: (value: any) => void
}

export interface IUseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  filterFields?: DataTableFilterField[]
  filterSchema?: Record<string, any>
  params?: any
}
