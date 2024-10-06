import { DataTable, Toolbar } from '@mazic/components'
import { useDataTable, useFilter } from '@mazic/hooks'
import { commonFilterSchema as filterSchema } from '@mazic/schemas/filterSchema'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { useListHabit } from '../hooks/apis'
import { useHabitColumns } from '../hooks/useHabitColumns'

const HabitListPage = () => {
  const filterFields: DataTableFilterField[] = []
  const { filterList, params, search, isFiltered, onReset } = useFilter(filterSchema, filterFields)

  const { data, meta, refetch } = useListHabit(params)
  const columns = useHabitColumns({ refreshTable: refetch })

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

export default HabitListPage
