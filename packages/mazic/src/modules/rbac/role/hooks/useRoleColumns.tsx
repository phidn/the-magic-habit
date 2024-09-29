import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@mazic-design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks'
import { useStoreShallow } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { TRole } from '../schemas/roleSchema'

import { useRoleApis } from './useRoleApis'

export const useRoleColumns = ({ refreshTable }: ITableColsProps): ColumnDef<TRole>[] => {
  const mutationDelete = useRoleApis.delete()
  const [showAlertLoading, hideAlert, setAlert] = useStoreShallow((state) => [
    state.showAlertLoading,
    state.hideAlert,
    state.setAlert,
  ])
  const { statusColumn, createdAtColumn } = useColumnCommon()

  return useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => row.getValue('name'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        cell: ({ row }) => row.getValue('description'),
        enableSorting: true,
        enableHiding: true,
      },
      statusColumn,
      createdAtColumn,
      {
        accessorKey: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader className="text-center" column={column} title="Actions" />
        ),
        cell: ({ cell }) => (
          <ActionColumn
            pathDetail={`/role/view/${cell.row.original.id}`}
            pathEdit={`/role/edit/${cell.row.original.id}`}
            onDelete={() => {
              setAlert({
                open: true,
                title: 'Delete item',
                description:
                  'If you delete this item, it will be gone forever. Are you sure you want to delete it?',
                onConfirm: () => {
                  showAlertLoading()
                  mutationDelete.mutate(cell.row.original.id, {
                    onSuccess: () => {
                      hideAlert()
                      typeof refreshTable === 'function' && refreshTable()
                    },
                  })
                },
              })
            }}
          />
        ),
        enableSorting: false,
        enableHiding: true,
      },
    ],
    [
      createdAtColumn,
      hideAlert,
      mutationDelete,
      refreshTable,
      setAlert,
      showAlertLoading,
      statusColumn,
    ]
  )
}
