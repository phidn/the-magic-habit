import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import isEqual from 'lodash/isEqual'

import { Button } from '@mazic-design-system'

import { DataTableClient } from '@mazic/components/DataTable'
import { TRole } from '@mazic/schemas/roleSchema'

import { useRolesPermissionsColumns } from '../../hooks/columns'
import { TMatrix, TRolePermissionExtended } from '../../types'
import { extractPermissions, processRows } from '../../utils/utils'

export type FormValues = {
  rolesPermissions: TMatrix[]
}

interface RolePermissionFormProps {
  data: TRolePermissionExtended[]
  roleData: TRole[]
  isLoading?: boolean
  onSubmitForm: (values: any) => any
}

export const RolePermissionForm = ({
  data,
  roleData,
  onSubmitForm,
  isLoading,
}: RolePermissionFormProps) => {
  const initialValues = useMemo(() => processRows(data, roleData), [data, roleData])

  const methods = useForm<FormValues>({
    values: { rolesPermissions: initialValues },
  })
  const roleColumns = useRolesPermissionsColumns(roleData)
  const isDirty = !isEqual(initialValues, methods.watch('rolesPermissions'))

  const onSubmit = async (values: FormValues) => {
    const payload = extractPermissions(values.rolesPermissions)
    await onSubmitForm(payload)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DataTableClient
          isLoading={isLoading}
          shouldExpandAllRows
          enablePagination={false}
          data={initialValues}
          columns={roleColumns}
          getSubRows={(row: any) => row?.children}
          actionRender={() => (
            <Button disabled={!isDirty} className="h-8 px-2 lg:px-3 mr-2">
              Save
            </Button>
          )}
        />
      </form>
    </FormProvider>
  )
}
