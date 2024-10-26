import { ButtonLoading, TrashIcon } from '@mazic/ui'

import { DataTable, Toolbar } from '@mazic/components'
import { ToolbarFloating } from '@mazic/components/ToolbarFloating/ToolbarFloating'
import { FILTER_COMMON } from '@mazic/config/dataTable'
import { RESOURCES, useDataTable, useFilter, useGetOptions } from '@mazic/hooks'
import { useStoreShallow } from '@mazic/store/useStore'
import { DataTableFilterField } from '@mazic/types/dataTable'

import {
  useBulkDeletePermission,
  usePermissionList,
  useSeedPermission,
} from '../hooks/usePermissionApis'
import { usePermissionColumns } from '../hooks/usePermissionColumns'
import { filterSchema } from '../schemas/permissionSchema'

const PermissionListPage = () => {
  const { options: resourceOptions } = useGetOptions(RESOURCES.RESOURCE)

  const filterFields: DataTableFilterField[] = [
    FILTER_COMMON.status,
    {
      title: 'Resource',
      filterKey: 'resource_id',
      options: resourceOptions,
      multiSelect: true,
    },
  ]
  const { filterList, params, search, isFiltered, onReset } = useFilter(filterSchema, filterFields)

  const { data, meta, refetch } = usePermissionList(params)
  const columns = usePermissionColumns({ refreshTable: refetch })

  const { table } = useDataTable({
    data: data || [],
    columns: columns,
    pageCount: meta?.pagination.pageCount,
    filterFields,
    filterSchema,
    params,
  })

  const seedPermission = useSeedPermission()
  const bulkDelete = useBulkDeletePermission()

  const [hideModal, showModalBulkDelete] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalBulkDelete,
  ])

  return (
    <>
      <Toolbar
        table={table}
        isFiltered={isFiltered}
        onReset={onReset}
        search={search}
        filterFields={filterList}
        renderActions={() => (
          <ButtonLoading
            variant="outline"
            className="h-8 px-2 lg:px-3 mr-2"
            isLoading={seedPermission.isPending}
            onClick={() =>
              seedPermission.mutate(undefined, {
                onSuccess: () => refetch(),
              })
            }
          >
            Seed
          </ButtonLoading>
        )}
      />
      <DataTable table={table} />
      <ToolbarFloating
        table={table}
        bulkActions={{
          label: 'Delete',
          icon: <TrashIcon className="size-3.5" />,
          onClick: () => {
            showModalBulkDelete({
              onConfirm: () => {
                bulkDelete.mutate(Object.keys(table.getState().rowSelection), {
                  onSuccess: () => {
                    table.resetRowSelection()
                    refetch()
                    hideModal()
                  },
                })
              },
            })
          },
          loading: bulkDelete.isPending,
        }}
      />
    </>
  )
}

export default PermissionListPage
