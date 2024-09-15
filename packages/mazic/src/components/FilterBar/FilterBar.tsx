import { Cross2Icon } from '@radix-ui/react-icons'
import { Table as TTable } from '@tanstack/react-table'

import { Button } from '@mazic-design-system'

import { DataTableViewOptions } from '../DataTable/DataTableViewOptions'

interface FilterBarProps<TData> {
  table: TTable<TData>
  filterRender?: (table: TTable<TData>) => React.ReactNode
  actionRender?: (table: TTable<TData>) => React.ReactNode
  enableConfigView?: boolean
}

const FilterBar = <TData,>({
  table,
  filterRender,
  actionRender,
  enableConfigView = true,
}: FilterBarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {typeof filterRender === 'function' && filterRender(table)}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {typeof actionRender === 'function' && actionRender(table)}
      <DataTableViewOptions table={table} enableConfigView={enableConfigView} />
    </div>
  )
}

export default FilterBar
