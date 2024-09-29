import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'

import { Badge, Checkbox } from '@mazic-design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks/useColumnCommon'
import { useStoreShallow } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { TUser } from '../schemas/userSchema'

import { useUserApis } from './useUserApis'

export const useUserColumns = ({ refreshTable }: ITableColsProps): ColumnDef<TUser>[] => {
  const { t } = useTranslation()
  const mutationDelete = useUserApis.delete()
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
        accessorKey: 'first_name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('system.user.firstName')} />
        ),
        cell: ({ row }) => row.getValue('first_name'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'last_name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('system.user.lastName')} />
        ),
        cell: ({ row }) => row.getValue('last_name'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('system.email')} />,
        cell: ({ row }) => row.getValue('email'),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'verified',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('form.verified')} />
        ),
        cell: ({ row }) => (
          <div>
            {!!row.getValue('verified') && (
              <Badge variant="outline-primary">{t('form.verified')}</Badge>
            )}
            {!row.getValue('verified') && (
              <Badge variant="outline-destructive">{t('form.notVerified')}</Badge>
            )}
          </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
    [createdAtColumn, hideAlert, mutationDelete, refreshTable, setAlert, showAlertLoading, t]
  )
}
