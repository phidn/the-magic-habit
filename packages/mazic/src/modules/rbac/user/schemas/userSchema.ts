import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  avatar: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  is_active: z.boolean().default(true),
  user_role_ids: z.array(z.string()).optional().nullable(),
})

export type TUserRole = {
  id: string
  role_id: string
  user_id: string
}

export type TUserCreate = z.infer<typeof userSchema>
export type TUser = TUserCreate & {
  id: string
  user_roles: TUserRole[]
}
