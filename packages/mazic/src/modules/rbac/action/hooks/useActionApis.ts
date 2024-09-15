import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiResponse, IPaginationApi } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TAction, TActionCreate } from '../schemas/actionSchema'
import { actionService } from '../services/actionService'

const QUERY_KEY = 'actions' as const

const useActionList = (pagination: IPaginationApi) => {
  const { data, ...rest } = useQuery({
    queryFn: () => actionService.query<ApiResponse<TAction[]>>(pagination),
    queryKey: [QUERY_KEY, 'actions_list', pagination],
  })
  return { ...data?.data, ...rest }
}

const useActionDetail = (actionId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => actionService.get<ApiResponse<TAction>>(actionId),
    queryKey: [QUERY_KEY, actionId, 'actions_detail'],
    enabled: !!actionId,
  })

  return { ...data?.data, ...rest }
}

const useUpdateAction = (actionId: string) => {
  return useMutation({
    mutationFn: (payload: TAction) => actionService.update(actionId, payload),
    onSuccess: () => toast.success('Successfully updated action'),
  })
}

const useCreateAction = () => {
  return useMutation({
    mutationFn: (payload: TActionCreate) => actionService.create(payload),
    onSuccess: () => toast.success('Successfully created action'),
  })
}

const useUpsertAction = (actionId: string) => {
  const updateAction = useUpdateAction(actionId)
  const createAction = useCreateAction()

  return actionId ? updateAction : createAction
}

const useDeleteAction = () => {
  return useMutation({
    mutationFn: (actionId: string) => actionService.delete(actionId),
    onSuccess: () => toast.success('Successfully deleted action'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete action')
    },
  })
}

export const useActionApis = {
  list: useActionList,
  detail: useActionDetail,
  create: useCreateAction,
  update: useUpdateAction,
  upsert: useUpsertAction,
  delete: useDeleteAction,
}
