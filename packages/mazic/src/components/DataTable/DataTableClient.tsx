import { useEffect, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  Table as TTable,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@mazic-design-system'

import FilterBar from '../FilterBar/FilterBar'

import { DataTablePagination } from './DataTablePagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: PaginationState
  manualPagination?: boolean
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>
  pageCount?: number
  enablePagination?: boolean
  enableConfigView?: boolean
  shouldExpandAllRows?: boolean
  isLoading?: boolean
  filterRender?: (table: TTable<TData>) => React.ReactNode
  actionRender?: (table: TTable<TData>) => React.ReactNode
  getSubRows?: (row: TData) => TData[]
}

// TODO: add loading DataTable
export const DataTableClient = <TData, TValue>({
  columns,
  data,
  filterRender,
  actionRender,
  pagination,
  manualPagination = true,
  enablePagination = true,
  onPaginationChange,
  pageCount,
  enableConfigView = true,
  getSubRows,
  shouldExpandAllRows = false,
  ...restProps
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      ...(pagination ? { pagination } : {}),
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    manualPagination: enablePagination === false ? true : manualPagination,
    pageCount: pageCount,
    onPaginationChange,
    getSubRows,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    ...restProps,
  })

  useEffect(() => {
    if (shouldExpandAllRows) {
      table.toggleAllRowsExpanded()
    }
  }, [table, shouldExpandAllRows])

  return (
    <div className="space-y-4">
      <FilterBar
        table={table}
        filterRender={filterRender}
        actionRender={actionRender}
        enableConfigView={enableConfigView}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && <DataTablePagination table={table} />}
    </div>
  )
}
