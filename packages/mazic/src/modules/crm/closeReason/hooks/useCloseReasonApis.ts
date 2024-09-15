import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiResponse } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TCloseReason, TCloseReasonCreate, TSearchParamsSchema } from '../schemas/closeReasonSchema'
import { closeReasonService } from '../services/closeReasonService'

const QUERY_KEY = 'close_reasons' as const

const useCloseReasonList = (params: TSearchParamsSchema) => {
  const { data, ...rest } = useQuery({
    queryFn: () => closeReasonService.query<ApiResponse<TCloseReason[]>>(params),
    queryKey: [QUERY_KEY, 'close_reasons_list', params],
  })
  return { ...data?.data, ...rest }
}

const useCloseReasonDetail = (closeReasonId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => closeReasonService.get<ApiResponse<TCloseReason>>(closeReasonId),
    queryKey: [QUERY_KEY, closeReasonId, 'close_reasons_detail'],
    enabled: !!closeReasonId,
  })

  return { ...data?.data, ...rest }
}

const useUpdateCloseReason = (closeReasonId: string) => {
  return useMutation({
    mutationFn: (payload: TCloseReason) => closeReasonService.update(closeReasonId, payload),
    onSuccess: () => toast.success('Successfully updated close reason'),
  })
}

const useCreateCloseReason = () => {
  return useMutation({
    mutationFn: (payload: TCloseReasonCreate) => closeReasonService.create(payload),
    onSuccess: () => toast.success('Successfully created close reason'),
  })
}

const useUpsertCloseReason = (closeReasonId: string) => {
  const updateCloseReason = useUpdateCloseReason(closeReasonId)
  const createCloseReason = useCreateCloseReason()

  return closeReasonId ? updateCloseReason : createCloseReason
}

const useDeleteCloseReason = () => {
  return useMutation({
    mutationFn: (closeReasonId: string) => closeReasonService.delete(closeReasonId),
    onSuccess: () => toast.success('Successfully deleted close reason'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete close reason')
    },
  })
}

export const useCloseReasonApis = {
  list: useCloseReasonList,
  detail: useCloseReasonDetail,
  update: useUpdateCloseReason,
  create: useCreateCloseReason,
  upsert: useUpsertCloseReason,
  delete: useDeleteCloseReason,
}
