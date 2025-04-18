import { z } from 'zod'

import { criterionSchema } from '../validations/criterion'

export type TCriterion = z.infer<typeof criterionSchema>
