import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@mazic/design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks'
import { useStoreShallow } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { TAction } from '../schemas/actionSchema'

import { useActionApis } from './useActionApis'

export const useActionColumns = ({ refreshTable }: ITableColsProps): ColumnDef<TAction>[] => {
  const mutationDelete = useActionApis.delete()
  const [hideModal, showModalDelete] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalDelete,
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
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
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
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => row.getValue('code'),
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
        accessorKey: 'action',
        header: ({ column }) => (
          <DataTableColumnHeader className="text-center" column={column} title="Action" />
        ),
        cell: ({ cell }) => (
          <ActionColumn
            pathDetail={`/action/view/${cell.row.original.id}`}
            pathEdit={`/action/edit/${cell.row.original.id}`}
            onDelete={() => {
              showModalDelete({
                onConfirm: () => {
                  mutationDelete.mutate(cell.row.original.id, {
                    onSuccess: () => {
                      hideModal()
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
    [createdAtColumn, hideModal, mutationDelete, refreshTable, showModalDelete, statusColumn]
  )
}
