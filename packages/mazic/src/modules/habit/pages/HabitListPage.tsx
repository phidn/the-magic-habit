import { DataTable, Toolbar } from '@mazic/components'
import { useDataTable, useFilter } from '@mazic/hooks'
import { commonFilterSchema as filterSchema } from '@mazic/schemas/filterSchema'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { habitApis } from '../apis'
import { useHabitColumns } from '../columns'

const HabitListPage = () => {
  const filterFields: DataTableFilterField[] = []
  const { filterList, params, search, isFiltered, onReset } = useFilter(filterSchema, filterFields)

  const { data, meta, refetch } = habitApis.useList(params)
  const columns = useHabitColumns({ refreshTable: refetch })

  const { table } = useDataTable({
    data: data || [],
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

export default HabitListPage
