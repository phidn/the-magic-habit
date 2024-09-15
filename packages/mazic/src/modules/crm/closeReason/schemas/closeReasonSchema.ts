import { z } from 'zod'

import { commonFilterSchema } from '@mazic/schemas/filterSchema'

export const closeReasonSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  value: z.string().min(1, 'Value is required'),
  is_active: z.boolean().default(true),
})

export const filterSchema = z.object({
  ...commonFilterSchema.shape,
  type: z.string().optional(),
})

export type TCloseReasonCreate = z.infer<typeof closeReasonSchema>
export type TCloseReason = TCloseReasonCreate & { id: string }

export type TSearchParamsSchema = z.infer<typeof filterSchema>
