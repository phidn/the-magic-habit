import { DataTable, Toolbar } from '@mazic/components'
import { FILTER_COMMON } from '@mazic/config/dataTable'
import { useDataTable, useFilter } from '@mazic/hooks'
import { commonFilterSchema as filterSchema } from '@mazic/schemas/filterSchema'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { useRoleApis } from '../hooks/useRoleApis'
import { useRoleColumns } from '../hooks/useRoleColumns'

const RoleListPage = () => {
  const filterFields: DataTableFilterField[] = [FILTER_COMMON.status]
  const { filterList, params, search, isFiltered, onReset } = useFilter({
    filterSchema,
    filterFields,
  })

  const { data, meta, refetch } = useRoleApis.list(params)
  const columns = useRoleColumns({ refreshTable: refetch })

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

export default RoleListPage
