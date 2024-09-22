import { z } from 'zod'

import { DataTable, Toolbar } from '@mazic/components'
import { FILTER_COMMON } from '@mazic/config/dataTable'
import { useDataTable, useFilter } from '@mazic/hooks'
import { commonFilterSchema } from '@mazic/schemas/filterSchema'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { useUserApis } from '../hooks/useUserApis'
import { useUserColumns } from '../hooks/useUserColumns'

const filterSchema = {
  ...commonFilterSchema,
  verified: z.string().optional(),
}

const UserListPage = () => {
  const filterFields: DataTableFilterField[] = [FILTER_COMMON.verified]
  const { filterList, params, search, isFiltered, onReset } = useFilter(filterSchema, filterFields)

  const { data, meta, refetch } = useUserApis.list(params)
  const columns = useUserColumns({ refreshTable: refetch })

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

export default UserListPage
