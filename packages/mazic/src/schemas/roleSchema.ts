import { z } from 'zod'

export const RoleDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role_key: z.string().min(1, 'Role key is required'),
  description: z.string().optional(),
})

export const RoleStatusSchema = z.object({
  is_active: z.boolean(),
})

export const UpsertRoleSchema = z.object({
  ...RoleDetailsSchema.shape,
  ...RoleStatusSchema.shape,
})

export type TRole = z.infer<typeof UpsertRoleSchema> & { id: string }
