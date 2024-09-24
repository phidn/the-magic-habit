import { z } from 'zod'

const detailSection = {
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
}

export const detailFields = Object.keys(detailSection)

export const roleSchema = z.object({
  ...detailSection,
  is_active: z.boolean().default(true),
})

export type TRoleCreate = z.infer<typeof roleSchema>
export type TRole = TRoleCreate & { id: string }
