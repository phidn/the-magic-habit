import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { Badge, Checkbox } from '@mazic-design-system'

import { ActionColumn } from '@mazic/components/Columns/ActionColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { useColumnCommon } from '@mazic/hooks/useColumnCommon'
import { useStore } from '@mazic/store/useStore'
import { ITableColsProps } from '@mazic/types/index'

import { TCloseReason } from '../schemas/closeReasonSchema'

import { useCloseReasonApis } from './useCloseReasonApis'

export const useCloseReasonColumns = ({
  refreshTable,
}: ITableColsProps): ColumnDef<TCloseReason>[] => {
  const { t } = useTranslation()

  const mutationDelete = useCloseReasonApis.delete()
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
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('crm.closeReason.type')} />
        ),
        cell: ({ row }) => t(`crm.closeReason.${row.getValue('type')}`),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'value',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('crm.closeReason.text')} />
        ),
        cell: ({ row }) => row.getValue('value'),
        enableSorting: true,
        enableHiding: true,
      },
      statusColumn,
      createdAtColumn,
      {
        accessorKey: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader
            className="text-center"
            column={column}
            title={t('system.actions')}
          />
        ),
        cell: ({ cell }) => (
          <ActionColumn
            pathDetail={`/close-reason/view/${cell.row.original.id}`}
            pathEdit={`/close-reason/edit/${cell.row.original.id}`}
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
      t,
    ]
  )
}
