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
  verified: z.boolean().default(true),
  roles: z.array(z.string()).optional(),
})

export type TUserCreate = z.infer<typeof userSchema>
export type TUser = TUserCreate & {
  id: string
}
