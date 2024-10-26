import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TAction, TActionCreate } from '../schemas/actionSchema'
import { actionService } from '../services/actionService'

const QUERY_KEY = 'actions' as const

export const useActionList = (pagination: IParams) => {
  const { data, refetch } = useQuery({
    queryFn: () => actionService.query(pagination),
    queryKey: [QUERY_KEY, 'actions_list', pagination],
  })
  return {
    data: data?.data.data || [],
    meta: data?.data.meta,
    refetch,
  }
}

export const useActionDetail = (actionId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => actionService.get(actionId),
    queryKey: [QUERY_KEY, actionId, 'actions_detail'],
    enabled: !!actionId,
  })

  return { ...data?.data, ...rest }
}

export const useUpdateAction = (actionId: string) => {
  return useMutation({
    mutationFn: (payload: TAction) => actionService.update(actionId, payload),
    onSuccess: () => toast.success('Successfully updated action'),
  })
}

export const useCreateAction = () => {
  return useMutation({
    mutationFn: (payload: TActionCreate) => actionService.create(payload),
    onSuccess: () => toast.success('Successfully created action'),
  })
}

export const useUpsertAction = (actionId: string) => {
  const updateAction = useUpdateAction(actionId)
  const createAction = useCreateAction()

  return actionId ? updateAction : createAction
}

export const useDeleteAction = () => {
  return useMutation({
    mutationFn: (actionId: string) => actionService.delete(actionId),
    onSuccess: () => toast.success('Successfully deleted action'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete action')
    },
  })
}
