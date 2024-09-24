import { z } from 'zod'

const detailSection = {
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
}

export const detailFields = Object.keys(detailSection)

export const actionSchema = z.object({
  ...detailSection,
  is_active: z.boolean().default(true),
})

export type TActionCreate = z.infer<typeof actionSchema>
export type TAction = TActionCreate & { id: string }
