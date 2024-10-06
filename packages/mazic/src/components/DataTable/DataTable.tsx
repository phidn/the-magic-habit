import { useEffect } from 'react'
import { flexRender, Table as TTable } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@mazic/design-system'

import { DataTablePagination } from '../DataTable/DataTablePagination'

interface DataTableProps<TData> {
  table: TTable<TData>
  enablePagination?: boolean
  enableConfigView?: boolean
  shouldExpandAllRows?: boolean
  isLoading?: boolean
  filterRender?: (table: TTable<TData>) => React.ReactNode
  actionRender?: (table: TTable<TData>) => React.ReactNode
  getSubRows?: (row: TData) => TData[]
}

export const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const { table, enablePagination = true, shouldExpandAllRows = false } = props

  useEffect(() => {
    if (shouldExpandAllRows) {
      table.toggleAllRowsExpanded()
    }
  }, [table, shouldExpandAllRows])

  return (
    <div className="space-y-4">
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
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
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
