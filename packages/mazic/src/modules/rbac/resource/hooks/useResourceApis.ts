import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiResponse, IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TResource, TResourceCreate } from '../schemas/resourceSchema'
import { resourceService } from '../services/resourceService'

const QUERY_KEY = 'resources' as const

const useResourceList = (params: IParams) => {
  const { data, ...rest } = useQuery({
    queryFn: () => resourceService.query<ApiResponse<TResource[]>>(params),
    queryKey: [QUERY_KEY, 'resources_list', params],
  })
  return { ...data?.data, ...rest }
}

const useResourceDetail = (resourceId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => resourceService.get<ApiResponse<TResource>>(resourceId),
    queryKey: [QUERY_KEY, resourceId, 'resources_detail'],
    enabled: !!resourceId,
  })

  return { ...data?.data, ...rest }
}

const useUpdateResource = (resourceId: string) => {
  return useMutation({
    mutationFn: (payload: TResource) => resourceService.update(resourceId, payload),
    onSuccess: () => toast.success('Successfully updated resource'),
  })
}

const useCreateResource = () => {
  return useMutation({
    mutationFn: (payload: TResourceCreate) => resourceService.create(payload),
    onSuccess: () => toast.success('Successfully created resource'),
  })
}

const useDeleteResource = () => {
  return useMutation({
    mutationFn: (resourceId: string) => resourceService.delete(resourceId),
    onSuccess: () => toast.success('Successfully deleted resource'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete resource')
    },
  })
}

export const useResourceApis = {
  list: useResourceList,
  detail: useResourceDetail,
  create: useCreateResource,
  update: useUpdateResource,
  delete: useDeleteResource,
}
