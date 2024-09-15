import { useQuery } from '@tanstack/react-query'

import { entryService } from '@mazic/services/entryService'
import { IOption } from '@mazic/types/dataTable'
import { ApiResponse } from '@mazic/types/index'

const QUERY_KEY = 'options' as const

export const useGetOptions = (resource: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => entryService.getOptions<ApiResponse<IOption[]>>(resource),
    queryKey: [QUERY_KEY, 'options', resource],
  })
  return { ...data?.data, ...rest }
}
