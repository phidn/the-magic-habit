import { z } from 'zod'

import { TPermission } from '../../permission/schemas/permissionSchema'

const detailSection = {
  id: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  avatar: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
}

export const detailFields = Object.keys(detailSection)

export const userSchema = z.object({
  ...detailSection,
  verified: z.boolean().default(true),
  roles: z.array(z.string()).optional(),
})

export type TUserCreate = z.infer<typeof userSchema>

export type TUserSetting = {
  habit_cols: number
  habit_orders: string
}

export type TUser = TUserCreate & {
  id: string
  permissions: TPermission[]
  setting: TUserSetting
}

export type TUserProfile = TUserCreate & {
  id: string
  permissions: TPermission[]
  habit_cols: number
  habit_orders: string
}
