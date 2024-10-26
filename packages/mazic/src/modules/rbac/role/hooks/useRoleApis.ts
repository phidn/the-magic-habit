import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TRole, TRoleCreate } from '../schemas/roleSchema'
import { roleService } from '../services/roleService'

const QUERY_KEY = 'roles' as const

export const useRoleList = (params: IParams) => {
  const { data, refetch } = useQuery({
    queryFn: () => roleService.query(params),
    queryKey: [QUERY_KEY, 'roles_list', params],
  })

  return {
    data: data?.data.data || [],
    meta: data?.data.meta,
    refetch,
  }
}

export const useRoleDetail = (roleId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => roleService.get(roleId),
    queryKey: [QUERY_KEY, roleId, 'roles_detail'],
    enabled: !!roleId,
  })

  return { ...data?.data, ...rest }
}

export const useUpdateRole = (roleId: string) => {
  return useMutation({
    mutationFn: (payload: TRole) => roleService.update(roleId, payload),
    onSuccess: () => toast.success('Successfully updated role'),
  })
}

export const useCreateRole = () => {
  return useMutation({
    mutationFn: (payload: TRoleCreate) => roleService.create(payload),
    onSuccess: () => toast.success('Successfully created role'),
  })
}

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (roleId: string) => roleService.delete(roleId),
    onSuccess: () => toast.success('Successfully deleted role'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete role')
    },
  })
}
