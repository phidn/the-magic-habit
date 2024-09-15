import { useMutation, useQueries } from '@tanstack/react-query'
import map from 'lodash/map'
import snakeCase from 'lodash/snakeCase'
import { toast } from 'sonner'

import { TRole } from '@mazic/schemas/roleSchema'
import { roleService } from '@mazic/services/roleService'
import { ApiResponse } from '@mazic/types/index'

import { rolePermissionService } from '../services/rolePermissionService'
import {
  TRolePermission,
  TRolePermissionExtended,
  TRolePermissionReq,
} from '../types/RolePermissionType'

const QUERY_KEY = 'roles_permissions' as const

export const useRolesPermissionsList = () => {
  const [result_1, result_2] = useQueries({
    queries: [
      {
        queryFn: () => rolePermissionService.query<ApiResponse<TRolePermission[]>>(),
        queryKey: [QUERY_KEY, 'roles_permissions_list'],
      },
      {
        queryFn: () => roleService.query<ApiResponse<TRole[]>>({ page: 1, pageSize: -1 }),
        queryKey: [QUERY_KEY, 'roles_list'],
      },
    ],
  })
  const dataList: TRolePermissionExtended[] = map(
    result_1?.data?.data?.data,
    (item: TRolePermission) => ({
      ...item,
      permission_key: snakeCase(item.permission_name),
      resource_key: snakeCase(item.resource_name),
    })
  )

  return {
    data: dataList,
    roleData: result_2.data?.data?.data || [],
    isLoading: result_1.isLoading || result_2.isLoading,
  }
}
export const useUpsertRolePermission = () => {
  return useMutation({
    mutationFn: (payload: TRolePermissionReq[]) => rolePermissionService.upsert(payload),
    onSuccess: () => toast.success('Successfully updated role'),
    onError: (error) => toast.error(error.message),
  })
}
