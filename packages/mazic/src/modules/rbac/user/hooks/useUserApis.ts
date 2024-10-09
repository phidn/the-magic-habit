import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiResponse, IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TUser, TUserCreate } from '../schemas/userSchema'
import { userService } from '../services/userService'

const QUERY_KEY = 'users' as const

const useUserList = (params: IParams) => {
  const { data, refetch } = useQuery({
    queryFn: () => userService.list<ApiResponse<TUser[]>>(params),
    queryKey: [QUERY_KEY, 'users_list', params],
  })
  return { ...data?.data, refetch }
}

const useUserDetail = (userId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => userService.get<ApiResponse<TUser>>(userId),
    queryKey: [QUERY_KEY, userId, 'users_detail'],
    enabled: !!userId,
  })
  return { ...data?.data, ...rest }
}

const useProfile = () => {
  const { data, ...rest } = useQuery({
    queryFn: () => userService.getMe<ApiResponse<TUser>>(),
    queryKey: [QUERY_KEY, 'profile'],
  })
  return { ...data?.data, ...rest }
}

const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationFn: async (payload: TUser) => userService.update(userId, payload),
    onSuccess: () => toast.success('Successfully updated user'),
  })
}

const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (payload: TUser) => userService.updateProfile(payload),
    onSuccess: () => toast.success('Successfully updated user'),
  })
}

const useCreateUser = () => {
  return useMutation({
    mutationFn: (payload: TUserCreate) => userService.create(payload),
    onSuccess: () => toast.success('Successfully created user'),
  })
}

const useUpsertUser = (userId: string) => {
  const updateUser = useUpdateUser(userId)
  const createUser = useCreateUser()

  return userId ? updateUser : createUser
}

const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => toast.success('Successfully deleted user'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete user')
    },
  })
}

export const useUserApis = {
  list: useUserList,
  detail: useUserDetail,
  profile: useProfile,
  update: useUpdateUser,
  updateProfile: useUpdateProfile,
  create: useCreateUser,
  upsert: useUpsertUser,
  delete: useDeleteUser,
}
