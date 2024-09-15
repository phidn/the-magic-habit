import { z } from 'zod'

export const actionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export type TActionCreate = z.infer<typeof actionSchema>
export type TAction = TActionCreate & { id: string }
