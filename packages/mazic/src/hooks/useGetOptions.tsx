import { useQuery } from '@tanstack/react-query'

import { entryService } from '@mazic/services/entryService'
import { IOption } from '@mazic/types/form'
import { ApiResponse, TObjectAny } from '@mazic/types/index'

/**
 * Get options from the API
 * @param resource
 * @returns
 */
export const useGetOptions = (resource: string, params?: TObjectAny, enabled = true) => {
  const { data } = useQuery({
    queryFn: () => entryService.getOptions<ApiResponse<IOption[]>>(resource, params),
    queryKey: ['options', resource, params],
    enabled,
  })

  const options = data?.data?.data || []
  return { options }
}

/**
 * Resources
 * refer to the resources in the API
 * packages/mazic-server/internal/mods/global/util.go -> resourceMap
 */
export const RESOURCES = {
  ROLE: 'ROLE',
  RESOURCE: 'RESOURCE',
  RESOURCE_NAME: 'RESOURCE_NAME',
  ACTION: 'ACTION',
} as const
