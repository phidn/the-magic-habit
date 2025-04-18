import { useMutation, useQuery } from '@tanstack/react-query'

import { TCriterion } from '@mazic/shared'
import { useAppContext } from '@mazic/hooks'

export const useCriteriaList = (habitId: string, options = {}) => {
  const { fetcher } = useAppContext()

  return useQuery({
    queryKey: ['criteria', habitId],
    queryFn: () => fetcher.get(`/mz/habits/${habitId}/criteria`),
    select: (data) => data?.data?.items || [],
    ...options,
  })
}

export const useCreateCriterion = (habitId: string) => {
  const { fetcher } = useAppContext()

  return useMutation({
    mutationFn: (data: Omit<TCriterion, 'id'>) =>
      fetcher.post(`/mz/habits/${habitId}/criteria`, data),
  })
}

export const useUpdateCriterion = (habitId: string, criterionId: string) => {
  const { fetcher } = useAppContext()

  return useMutation({
    mutationFn: (data: Partial<TCriterion>) =>
      fetcher.put(`/mz/habits/${habitId}/criteria/${criterionId}`, data),
  })
}

export const useDeleteCriterion = (habitId: string) => {
  const { fetcher } = useAppContext()

  return useMutation({
    mutationFn: (criterionId: string) =>
      fetcher.delete(`/mz/habits/${habitId}/criteria/${criterionId}`),
  })
}

export const useBatchCheckIn = () => {
  const { fetcher } = useAppContext()

  return useMutation({
    mutationFn: (data: {
      habit_id: string
      date: Date
      items: Array<{ criterion_id: string; value: number }>
      journal: string
    }) => fetcher.post('/mz/check-ins/batch', data),
  })
}
