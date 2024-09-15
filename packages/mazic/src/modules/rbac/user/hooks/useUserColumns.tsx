import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@mazic-design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks/useColumnCommon'
import { useStore } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { TUser } from '../schemas/userSchema'

import { useUserApis } from './useUserApis'

export const useUserColumns = ({ refreshTable }: ITableColsProps): ColumnDef<TUser>[] => {
  const mutationDelete = useUserApis.delete()
  const { showAlertLoading, hideAlert, setAlert } = useStore()
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
        accessorKey: 'first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="First name" />,
        cell: ({ row }) => row.getValue('first_name'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'last_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last name" />,
        cell: ({ row }) => row.getValue('last_name'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => row.getValue('email'),
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
            pathDetail={`/user/view/${cell.row.original.id}`}
            pathEdit={`/user/edit/${cell.row.original.id}`}
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
