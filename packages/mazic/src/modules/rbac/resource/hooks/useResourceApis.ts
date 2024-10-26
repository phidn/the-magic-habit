import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TResource, TResourceCreate } from '../schemas/resourceSchema'
import { resourceService } from '../services/resourceService'

const QUERY_KEY = 'resources' as const

export const useResourceList = (params: IParams) => {
  const { data, ...rest } = useQuery({
    queryFn: () => resourceService.query(params),
    queryKey: [QUERY_KEY, 'resources_list', params],
  })
  return { ...data?.data, ...rest }
}

export const useResourceDetail = (resourceId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => resourceService.get(resourceId),
    queryKey: [QUERY_KEY, resourceId, 'resources_detail'],
    enabled: !!resourceId,
  })

  return { ...data?.data, ...rest }
}

export const useUpdateResource = (resourceId: string) => {
  return useMutation({
    mutationFn: (payload: TResource) => resourceService.update(resourceId, payload),
    onSuccess: () => toast.success('Successfully updated resource'),
  })
}

export const useCreateResource = () => {
  return useMutation({
    mutationFn: (payload: TResourceCreate) => resourceService.create(payload),
    onSuccess: () => toast.success('Successfully created resource'),
  })
}

export const useDeleteResource = () => {
  return useMutation({
    mutationFn: (resourceId: string) => resourceService.delete(resourceId),
    onSuccess: () => toast.success('Successfully deleted resource'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete resource')
    },
  })
}
