import { z } from 'zod'

import { HeatMapValue } from '@mazic/components/HeatMap'
import { ColorName } from '@mazic/config/baseColors'
import { checkInType } from '@mazic/modules/check-in'

export const habitSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    check_in_type: z.string().min(1, 'Check-in type is required').default(checkInType.NUMBER),
    metric: z.string().optional().nullable(),
    week_start: z.string().optional().default('MONDAY'),
    color: z.string().min(1, 'Color is required').default('blue'),
    order: z.number().optional().default(0),
    is_private: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.check_in_type === checkInType.NUMBER && !data.metric) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Metric is required for number check-in',
        path: ['metric'],
      })
    }
  })

type TCheckIn = {
  id: string
  date: string
  value: number
  journal: string
  habit_id: string
  level: number
  count: number
  bar_value: number
  is_done?: boolean
}

export type THabit = z.infer<typeof habitSchema> & {
  id: string
  color: ColorName
  entries: TCheckIn[]
  activities: HeatMapValue[]
}

export type THabitCreate = THabit
