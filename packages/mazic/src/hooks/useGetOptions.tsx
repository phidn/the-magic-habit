import { useQuery } from '@tanstack/react-query'

import { entryService } from '@mazic/services/entryService'
import { IOption } from '@mazic/types/dataTable'
import { ApiResponse } from '@mazic/types/index'

/**
 * Get options from the API
 * @param resource
 * @returns
 */
export const useGetOptions = (resource: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => entryService.getOptions<ApiResponse<IOption[]>>(resource),
    queryKey: ['options', resource],
  })
  return { ...data?.data, ...rest }
}

/**
 * Resources
 * refer to the resources in the API
 * packages/mazic-server/internal/mods/global/util.go -> resourceMap
 */
export const RESOURCES = {
  ROLE: 'ROLE',
} as const
