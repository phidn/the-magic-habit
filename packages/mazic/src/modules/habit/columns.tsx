import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@mazic-design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks/useColumnCommon'
import { useStoreShallow } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { habitApis } from './apis'
import { THabit } from './validations'

export const useHabitColumns = ({ refreshTable }: ITableColsProps): ColumnDef<THabit>[] => {
  const mutationDelete = habitApis.delete()
  const [showAlertLoading, hideAlert, setAlert] = useStoreShallow((state) => [
    state.showAlertLoading,
    state.hideAlert,
    state.setAlert,
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
        accessorKey: 'week_start',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Week start" />,
        cell: ({ row }) => row.getValue('week_start'),
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
            pathDetail={`/habit/view/${cell.row.original.id}`}
            pathEdit={`/habit/edit/${cell.row.original.id}`}
            onDelete={() => {
              setAlert({
                open: true,
                title: 'Delete item',
                description:
                  'If you delete this item, it will be gone forever. Are you sure you want to delete it?',
                onConfirm: () => {
                  showAlertLoading()
                  mutationDelete.mutate(cell.row.original.id as string, {
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
    [createdAtColumn, hideAlert, mutationDelete, refreshTable, setAlert, showAlertLoading]
  )
}
