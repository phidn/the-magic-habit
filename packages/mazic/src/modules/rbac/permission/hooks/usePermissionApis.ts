import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiResponse, IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TPermission, TPermissionCreate } from '../schemas/permissionSchema'
import { permissionService } from '../services/permissionService'

const QUERY_KEY = 'permissions' as const

const usePermissionList = (params: IParams) => {
  const { data, ...rest } = useQuery({
    queryFn: () => permissionService.query<ApiResponse<TPermission[]>>(params),
    queryKey: [QUERY_KEY, 'permissions_list', params],
  })
  return { ...data?.data, ...rest }
}

const usePermissionByResource = (params: IParams) => {
  const { data } = useQuery({
    queryFn: () => permissionService.query<ApiResponse<TPermission[]>>(params),
    queryKey: [QUERY_KEY, 'permissions_list', params],
    enabled: !!params.resource_id,
  })
  const _data = data?.data?.data || []
  return {
    data: _data,
    actions: _data.map((item) => item.action_id),
  }
}

const usePermissionDetail = (permissionId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => permissionService.get<ApiResponse<TPermission>>(permissionId),
    queryKey: [QUERY_KEY, permissionId, 'permissions_detail'],
    enabled: !!permissionId,
  })

  return { ...data?.data, ...rest }
}

const useUpdatePermission = (permissionId: string) => {
  return useMutation({
    mutationFn: (payload: TPermission) => permissionService.update(permissionId, payload),
    onSuccess: () => toast.success('Successfully updated permission'),
  })
}

const useCreatePermission = () => {
  return useMutation({
    mutationFn: (payload: TPermissionCreate) => permissionService.create(payload),
    onSuccess: () => toast.success('Successfully created permission'),
  })
}

const useDeletePermission = () => {
  return useMutation({
    mutationFn: (permissionId: string) => permissionService.delete(permissionId),
    onSuccess: () => toast.success('Successfully deleted permission'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete permission')
    },
  })
}

const useSeedPermission = () => {
  return useMutation({
    mutationFn: () => permissionService.seed(),
    onSuccess: () => toast.success('Successfully seeded permission'),
  })
}

export const usePermissionApis = {
  list: usePermissionList,
  listByResource: usePermissionByResource,
  detail: usePermissionDetail,
  create: useCreatePermission,
  update: useUpdatePermission,
  delete: useDeletePermission,
  seed: useSeedPermission,
}
