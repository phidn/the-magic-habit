import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { z } from 'zod'

import { CONFIG } from '@mazic/config/config'
import { IUseDataTableProps } from '@mazic/types/dataTable'
import { createQueryString } from '@mazic/utils/utils'

export const commonParamsSchema = {
  page: z.coerce.number().default(CONFIG.pagination.page),
  pageSize: z.coerce.number().default(CONFIG.pagination.pageSize),
  sort: z.string().optional(),
  search: z.string().optional(),
  is_active: z.string().optional(),
}

export const useDataTable = <TData, TValue>(props: IUseDataTableProps<TData, TValue>) => {
  const { data, columns, pageCount, params = {} } = props
  const navigate = useNavigate()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const defaultPagination = {
    pageIndex: params.page - 1 || CONFIG.pagination.pageIndex,
    pageSize: params.pageSize || CONFIG.pagination.pageSize,
  }
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination)

  const [column, order] = params?.sort?.split(CONFIG.sortSeparator) ?? []
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: column ?? '',
      desc: order === 'desc',
    },
  ])

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const _value = typeof updater === 'function' ? updater(pagination) : updater
    const _search = createQueryString({
      ...params,
      page: _value.pageIndex + 1,
      pageSize: _value.pageSize,
    })
    navigate(`?${_search}`)
    setPagination(_value)
  }
  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const _value = typeof updater === 'function' ? updater(sorting) : updater
    const _search = createQueryString({
      ...params,
      sort: `${_value[0].id}${CONFIG.sortSeparator}${_value[0].desc ? 'DESC' : 'ASC'}`,
    })
    navigate(`?${_search}`)
    setSorting(_value)
  }
  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const _value = typeof updater === 'function' ? updater(columnFilters) : updater
    const _search = createQueryString({
      ...params,
      ...Object.fromEntries(
        _value.map((filter) => [filter.id, (filter.value as any).join(CONFIG.stringItemsSeparator)])
      ),
    })
    navigate(`?${_search}`)
    setColumnFilters(_value)
  }

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount || -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return {
    table,
  }
}
