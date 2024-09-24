import { z } from 'zod'

export const resourceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional().default(''),
  is_active: z.boolean().default(true),
  actions: z.array(z.string()).default([]),
})

export type TResourceCreate = z.infer<typeof resourceSchema>
export type TResource = TResourceCreate & { id: string }
