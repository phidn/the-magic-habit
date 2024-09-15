import { DataTable, Toolbar } from '@mazic/components'
import { FILTER_COMMON } from '@mazic/config/dataTable'
import { closeReasonTypeOptions } from '@mazic/config/forms'
import { useDataTable, useFilter } from '@mazic/hooks'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { useCloseReasonApis } from '../hooks/useCloseReasonApis'
import { useCloseReasonColumns } from '../hooks/useCloseReasonColumns'
import { filterSchema } from '../schemas/closeReasonSchema'

const CloseReasonListPage = () => {
  const filterFields: DataTableFilterField[] = [
    {
      title: 'Close type',
      label: 'Type',
      filterKey: 'type',
      options: closeReasonTypeOptions,
      multiSelect: true,
    },
    FILTER_COMMON.status,
  ]

  const { filterList, params, search, isFiltered, onReset } = useFilter({
    filterSchema,
    filterFields,
  })

  const { data, meta, refetch } = useCloseReasonApis.list(params)
  const closeReasonColumns = useCloseReasonColumns({ refreshTable: refetch })

  const { table } = useDataTable({
    data: data || [],
    columns: closeReasonColumns,
    pageCount: meta?.pagination.pageCount,
    filterFields,
    filterSchema,
    params,
  })

  return (
    <>
      <Toolbar
        table={table}
        isFiltered={isFiltered}
        onReset={onReset}
        search={search}
        filterFields={filterList}
      />
      <DataTable table={table} />
    </>
  )
}

export default CloseReasonListPage
