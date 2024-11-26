import { z } from 'zod'

import { checkInSchema } from '../validations'

export type THabitCheckIn = z.infer<typeof checkInSchema>
