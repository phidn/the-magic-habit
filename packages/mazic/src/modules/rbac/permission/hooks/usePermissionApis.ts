import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TPermission, TPermissionCreate } from '../schemas/permissionSchema'
import { permissionService } from '../services/permissionService'

const QUERY_KEY = 'permissions' as const

export const usePermissionList = (params: IParams) => {
  const { data, ...rest } = useQuery({
    queryFn: () => permissionService.query(params),
    queryKey: [QUERY_KEY, 'permissions_list', params],
  })
  return { ...data?.data, ...rest }
}

export const usePermissionByResource = (params: IParams) => {
  const { data } = useQuery({
    queryFn: () => permissionService.query(params),
    queryKey: [QUERY_KEY, 'permissions_list', params],
    enabled: !!params.resource_id,
  })
  const _data = data?.data?.data || []
  return {
    data: _data,
    actions: _data.map((item) => item.action_id),
  }
}

export const usePermissionDetail = (permissionId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => permissionService.get(permissionId),
    queryKey: [QUERY_KEY, permissionId, 'permissions_detail'],
    enabled: !!permissionId,
  })

  return { ...data?.data, ...rest }
}

export const useUpdatePermission = (permissionId: string) => {
  return useMutation({
    mutationFn: (payload: TPermission) => permissionService.update(permissionId, payload),
    onSuccess: () => toast.success('Successfully updated permission'),
  })
}

export const useCreatePermission = () => {
  return useMutation({
    mutationFn: (payload: TPermissionCreate) => permissionService.create(payload),
    onSuccess: () => toast.success('Successfully created permission'),
  })
}

export const useDeletePermission = () => {
  return useMutation({
    mutationFn: (permissionId: string) => permissionService.delete(permissionId),
    onSuccess: () => toast.success('Successfully deleted permission'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete permission')
    },
  })
}

export const useBulkDeletePermission = () => {
  return useMutation({
    mutationFn: (ids: string[]) => permissionService.bulkDelete(ids),
    onSuccess: () => toast.success('Successfully deleted permissions'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete permissions')
    },
  })
}

export const useSeedPermission = () => {
  return useMutation({
    mutationFn: () => permissionService.seed(),
    onSuccess: () => toast.success('Successfully seeded permission'),
  })
}
