import { useMemo } from 'react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

import { ExpandingColumn } from '@mazic/components/Columns/ExpandingColumn'
import { DataTableColumnHeader } from '@mazic/components/DataTable/DataTableColumnHeader'
import { TRole } from '@mazic/types/modules'

import { FormCheckbox } from '../components/RolePermissionForm/FormCheckbox'
import { TMatrix } from '../types'

const columnHelper = createColumnHelper<TMatrix>()

export const useRolesPermissionsColumns = (roles: TRole[]): ColumnDef<TMatrix>[] => {
  return useMemo(
    () => [
      {
        accessorKey: 'resource_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Resource" />,
        cell: ({ row }) => <ExpandingColumn row={row} rowKey="resource_name" />,
        enableSorting: false,
        enableHiding: false,
      },
      ...roles.map((role: TRole) => {
        return columnHelper.accessor(role.role_key, {
          header: ({ column }) => (
            <DataTableColumnHeader className="text-center" column={column} title={role.name} />
          ),
          cell: ({ row }) => <FormCheckbox row={row} role={role} />,
          enableSorting: false,
        })
      }),
    ],
    [roles]
  )
}
