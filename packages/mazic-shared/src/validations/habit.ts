import { z } from 'zod'

import { checkInType } from '../config'

export const habitSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    check_in_type: z.string().min(1, 'Check-in type is required').default(checkInType.INPUT_NUMBER),
    metric: z.string().optional().nullable(),
    week_start: z.string().optional().default('MONDAY'),
    color: z.string().min(1, 'Color is required').default('blue'),
    order: z.number().optional().default(0),
    template: z.string().optional().nullable(),
    is_private: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.check_in_type === checkInType.INPUT_NUMBER && !data.metric) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Metric is required for number check-in',
        path: ['metric'],
      })
    }
  })
