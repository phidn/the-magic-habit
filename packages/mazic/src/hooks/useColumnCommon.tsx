import { HTMLProps, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Column } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { Badge } from '@mazic-design-system'

import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'

interface ColumnCommon {
  accessorKey: string
  header: (props: { column: Column<any> }) => JSX.Element
  cell: (props: { row: { getValue: (key: string) => any } }) => JSX.Element | string
  filterFn?: (row: { getValue: (key: string) => any }, id: string, value: any[]) => boolean
  enableSorting: boolean
  enableHiding: boolean
}

interface IColumnCommonProps {
  statusColumn: ColumnCommon
  createdAtColumn: ColumnCommon
}

export const useColumnCommon = (): IColumnCommonProps => {
  const { t } = useTranslation()

  const statusColumn: ColumnCommon = {
    accessorKey: 'is_active',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('system.status')} />,
    cell: ({ row }) => (
      <div className="w-[80px]">
        {!!row.getValue('is_active') && <Badge variant="outline-primary">Active</Badge>}
        {!row.getValue('is_active') && <Badge variant="outline-destructive">In-active</Badge>}
      </div>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: true,
    enableHiding: true,
  }

  const createdAtColumn: ColumnCommon = {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('system.createdAt')} />,
    cell: ({ row }) => dayjs(row.getValue('created_at')).format('DD/MM/YYYY h:mm A'),
    enableSorting: true,
    enableHiding: true,
  }

  return {
    statusColumn,
    createdAtColumn,
  }
}

export const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />
}
