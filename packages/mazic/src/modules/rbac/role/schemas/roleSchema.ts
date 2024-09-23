import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export type TRoleCreate = z.infer<typeof roleSchema>
export type TRole = TRoleCreate & { id: string }
