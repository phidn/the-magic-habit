import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@mazic/design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks/useColumnCommon'
import { useStoreShallow } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { checkInMap } from './components/HabitForm/DetailForm'
import { habitApis } from './apis'
import { THabit } from './validations'

export const useHabitColumns = ({ refreshTable }: ITableColsProps): ColumnDef<THabit>[] => {
  const mutationDelete = habitApis.delete()
  const [hideModal, showModalDelete] = useStoreShallow((state) => [
    state.hideModal,
    state.showModalDelete,
  ])
  const { createdAtColumn } = useColumnCommon()

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
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => row.getValue('title'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'metric',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Metric" />,
        cell: ({ row }) => row.getValue('metric'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'color',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Color" />,
        cell: ({ row }) => row.getValue('color'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'check_in_type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Check-in type" />,
        cell: ({ row }) => {
          const val = checkInMap.get(row.getValue('check_in_type'))
          return (
            <div className="flex items-center">
              {val?.icon && <val.icon className="mr-2 h-4 w-4" />}
              {val?.label}
            </div>
          )
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'order',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
        cell: ({ row }) => row.getValue('order'),
        enableSorting: true,
        enableHiding: true,
      },
      createdAtColumn,
      {
        accessorKey: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader className="text-center" column={column} title="Actions" />
        ),
        cell: ({ cell }) => (
          <ActionColumn
            pathEdit={`/habit/edit/${cell.row.original.id}`}
            onDelete={() => {
              showModalDelete({
                onConfirm: () => {
                  mutationDelete.mutate(cell.row.original.id as string, {
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
    [createdAtColumn, hideModal, mutationDelete, refreshTable, showModalDelete]
  )
}
