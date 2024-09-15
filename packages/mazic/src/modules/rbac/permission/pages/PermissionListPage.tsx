import { Button } from '@mazic-design-system'

import { DataTable, Toolbar } from '@mazic/components'
import { FILTER_COMMON } from '@mazic/config/dataTable'
import { useDataTable, useFilter } from '@mazic/hooks'
import { commonFilterSchema as filterSchema } from '@mazic/schemas/filterSchema'
import { DataTableFilterField } from '@mazic/types/dataTable'

import { usePermissionApis } from '../hooks/usePermissionApis'
import { usePermissionColumns } from '../hooks/usePermissionColumns'

const PermissionListPage = () => {
  const filterFields: DataTableFilterField[] = [FILTER_COMMON.status]
  const { filterList, params, search, isFiltered, onReset } = useFilter({
    filterSchema,
    filterFields,
  })

  const { data, meta, refetch } = usePermissionApis.list(params)
  const columns = usePermissionColumns({ refreshTable: refetch })

  const { table } = useDataTable({
    data: data || [],
    columns: columns,
    pageCount: meta?.pagination.pageCount,
    filterFields,
    filterSchema,
    params,
  })

  const seedPermission = usePermissionApis.seed()

  return (
    <>
      <Toolbar
        table={table}
        isFiltered={isFiltered}
        onReset={onReset}
        search={search}
        filterFields={filterList}
        renderActions={() => (
          <Button
            variant="outline"
            className="h-8 px-2 lg:px-3 mr-2"
            isLoading={seedPermission.isPending}
            onClick={() => seedPermission.mutate()}
          >
            Seed
          </Button>
        )}
      />
      <DataTable table={table} />
    </>
  )
}

export default PermissionListPage
