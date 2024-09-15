import { z } from 'zod'

export const statusSchema = {
  is_active: z.boolean().default(true),
}
