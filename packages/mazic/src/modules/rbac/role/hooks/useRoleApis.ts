import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiResponse, IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TRole } from '../schemas/roleSchema'
import { roleService } from '../services/roleService'

const QUERY_KEY = 'roles' as const

const useRoleList = (params: IParams) => {
  const { data, ...rest } = useQuery({
    queryFn: () => roleService.query<ApiResponse<TRole[]>>(params),
    queryKey: [QUERY_KEY, 'roles_list', params],
  })
  const dataList = data?.data?.data || []
  return { ...data?.data, data: dataList, ...rest }
}

const useRoleDetail = (roleId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => roleService.get<ApiResponse<TRole>>(roleId),
    queryKey: [QUERY_KEY, roleId, 'roles_detail'],
    enabled: !!roleId,
  })

  return { ...data?.data, ...rest }
}

const useUpdateRole = (roleId: string) => {
  return useMutation({
    mutationFn: (payload: any) => roleService.update(roleId, payload),
    onSuccess: () => toast.success('Successfully updated role'),
  })
}

const useCreateRole = () => {
  return useMutation({
    mutationFn: (payload: any) => roleService.create(payload),
    onSuccess: () => toast.success('Successfully created role'),
  })
}

const useDeleteRole = () => {
  return useMutation({
    mutationFn: (roleId: string) => roleService.delete(roleId),
    onSuccess: () => toast.success('Successfully deleted role'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete role')
    },
  })
}

export const useRoleApis = {
  list: useRoleList,
  detail: useRoleDetail,
  update: useUpdateRole,
  create: useCreateRole,
  delete: useDeleteRole,
}
