import { useMutation, useQueries } from '@tanstack/react-query'
import map from 'lodash/map'
import snakeCase from 'lodash/snakeCase'
import { toast } from 'sonner'

import { useAppContext } from '@mazic/hooks/useAppContext'
import { ApiResponse } from '@mazic/types/index'
import { TRole } from '@mazic/types/modules'

import { rolePermissionService } from '../services/rolePermissionService'
import { TRolePermission, TRolePermissionExtended, TRolePermissionReq } from '../types'

const QUERY_KEY = 'roles_permissions' as const

export const useRolesPermissionsList = () => {
  const { services } = useAppContext()
  const [rp, roles] = useQueries({
    queries: [
      {
        queryFn: () => rolePermissionService.query<ApiResponse<TRolePermission[]>>(),
        queryKey: [QUERY_KEY, 'roles_permissions_list'],
      },
      {
        queryFn: () => services.roleService.query({ pageSize: -1 }),
        queryKey: [QUERY_KEY, 'roles_list'],
      },
    ],
  })
  const rpList: TRolePermissionExtended[] = map(rp?.data?.data?.data, (item: TRolePermission) => ({
    ...item,
    permission_key: snakeCase(item.permission_name),
    resource_key: snakeCase(item.resource_name),
    role_key: snakeCase(item.role_name),
  }))

  const roleData = map(roles?.data?.data?.data, (item: TRole) => ({
    ...item,
    role_key: snakeCase(item.name),
  }))

  return {
    data: rpList,
    roleData: roleData,
    isLoading: rp.isLoading || roles.isLoading,
  }
}
export const useUpsertRolePermission = () => {
  return useMutation({
    mutationFn: (payload: TRolePermissionReq[]) => rolePermissionService.upsert(payload),
    onSuccess: () => toast.success('Successfully updated role'),
    onError: (error) => toast.error(error.message),
  })
}
