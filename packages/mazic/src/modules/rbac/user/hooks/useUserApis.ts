import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useStore } from '@mazic/store/useStore'
import { IParams } from '@mazic/types/index'
import { ErrorResponse } from '@mazic/types/response'

import { TUser, TUserCreate, TUserProfile } from '../schemas/userSchema'
import { userService } from '../services/userService'

const QUERY_KEY = 'users' as const

export const useUserList = (params: IParams) => {
  const { data, refetch } = useQuery({
    queryFn: () => userService.list(params),
    queryKey: [QUERY_KEY, 'users_list', params],
  })
  return { ...data?.data, refetch }
}

export const useUserDetail = (userId: string) => {
  const { data, ...rest } = useQuery({
    queryFn: () => userService.get(userId),
    queryKey: [QUERY_KEY, userId, 'users_detail'],
    enabled: !!userId,
  })
  return { ...data?.data, ...rest }
}

export const useProfile = () => {
  const { data, ...rest } = useQuery({
    queryFn: () => userService.getMe(),
    queryKey: [QUERY_KEY, 'profile'],
  })
  return { ...data?.data, ...rest }
}

export const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationFn: async (payload: TUser) => userService.update(userId, payload),
    onSuccess: () => toast.success('Successfully updated user'),
  })
}

export const useUpdateProfile = () => {
  const setCurrentUser = useStore((state) => state.setCurrentUser)
  return useMutation({
    mutationFn: async (user: TUserProfile) => {
      const userProfile: TUser = {
        ...user,
        setting: {
          habit_cols: user.habit_cols,
          habit_orders: user.habit_orders,
        },
      }
      setCurrentUser(userProfile)
      return userService.updateProfile(userProfile)
    },
    onSuccess: () => toast.success('Successfully updated user'),
  })
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (payload: TUserCreate) => userService.create(payload),
    onSuccess: () => toast.success('Successfully created user'),
  })
}

export const useUpsertUser = (userId: string) => {
  const updateUser = useUpdateUser(userId)
  const createUser = useCreateUser()

  return userId ? updateUser : createUser
}

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => toast.success('Successfully deleted user'),
    onError: (error: ErrorResponse) => {
      toast.error(error?.error?.message || 'Failed to delete user')
    },
  })
}
