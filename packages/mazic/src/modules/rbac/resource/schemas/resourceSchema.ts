import { z } from 'zod'

const detailSection = {
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional().default(''),
}

export const detailFields = Object.keys(detailSection)

export const resourceSchema = z.object({
  ...detailSection,
  actions: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
})

export type TResourceCreate = z.infer<typeof resourceSchema>
export type TResource = TResourceCreate & { id: string }
