import { useLocation } from 'react-router-dom'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table as TTable } from '@tanstack/react-table'

import { Button, ButtonLink, PlusIcon } from '@mazic/ui'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { DataTableViewOptions } from '../DataTable/DataTableViewOptions'

import { FacetedFilter } from './FacetedFilter'
import { ToolbarSearch } from './ToolbarSearch'

interface ToolbarProps<TData> {
  table: TTable<TData>
  filterRender?: (table: TTable<TData>) => React.ReactNode
  isFiltered?: boolean
  enableCreate?: boolean
  enableSetting?: boolean
  onReset?: () => void
  search: any
  filterFields: DataTableFilterField[] | undefined
  renderActions?: () => React.ReactNode
}

export const Toolbar = <TData,>({
  table,
  search,
  isFiltered,
  enableCreate = true,
  enableSetting = false,
  onReset,
  filterFields,
  renderActions,
}: ToolbarProps<TData>) => {
  const { pathname } = useLocation()

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-1 items-center space-x-2">
        <ToolbarSearch search={search.value} onChangeSearch={search.onChange} />
        {(filterFields || []).map((filterField: any, index: number) => {
          return (
            <FacetedFilter
              key={filterField.filterKey || index}
              title={filterField?.title}
              options={filterField.options}
              multiSelect={filterField?.multiSelect}
              selectedValue={filterField?.selectedValue}
              onChange={filterField?.onChange}
            />
          )
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              typeof onReset === 'function' && onReset()
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {renderActions?.()}
      {enableCreate && (
        <ButtonLink href={`${pathname}/new`} className="h-8 px-2 lg:px-3 mr-2">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add new
        </ButtonLink>
      )}
      <DataTableViewOptions table={table} enableConfigView={enableSetting} />
    </div>
  )
}
