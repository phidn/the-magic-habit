import { z } from 'zod'

export type TZodAny = {
  [key: string]: z.ZodTypeAny
}
