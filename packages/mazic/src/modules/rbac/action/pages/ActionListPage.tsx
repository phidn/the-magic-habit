import { DataTable, Toolbar } from '@mazic/components'
import { FILTER_COMMON } from '@mazic/config/dataTable'
import { useDataTable, useFilter } from '@mazic/hooks'
import { commonFilterSchema as filterSchema } from '@mazic/schemas/filterSchema'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { useActionList } from '../hooks/useActionApis'
import { useActionColumns } from '../hooks/useActionColumns'

const ActionListPage = () => {
  const filterFields: DataTableFilterField[] = [FILTER_COMMON.status]
  const { filterList, params, search, isFiltered, onReset } = useFilter(filterSchema, filterFields)

  const { data, meta, refetch } = useActionList(params)
  const columns = useActionColumns({ refreshTable: refetch })

  const { table } = useDataTable({
    data,
    columns: columns,
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

export default ActionListPage
