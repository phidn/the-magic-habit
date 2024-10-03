import { z } from 'zod'

import { HeatMapValue } from '@mazic/components/HeatMap'
import { ColorName } from '@mazic/config/baseColors'

export const habitSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    check_in_type: z.string().min(1, 'Check-in type is required').default('NUMBER'),
    metric: z.string().optional().nullable(),
    week_start: z.string().optional().default('MONDAY'),
    color: z.string().min(1, 'Color is required').default('blue'),
    order: z.number().optional().default(0),
    is_private: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.check_in_type === 'NUMBER' && !data.metric) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Metric is required for number check-in',
        path: ['metric'],
      })
    }
  })

type THabitEntry = {
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
  color: ColorName
  entries: THabitEntry[]
  activities: HeatMapValue[]
}

export type THabitCreate = THabit

export const habitCheckInSchema = z
  .object({
    id: z.string().optional(),
    habit_id: z.string().min(1, 'Habit is required'),
    date: z.date({
      message: 'Date is required',
    }),
    value: z.number().optional().nullable(),
    is_done: z.boolean().default(false).optional(),
    journal: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (typeof data.is_done !== 'boolean' && !data.value) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must be greater than or equal to 0',
        path: ['value'],
      })
    }
  })

export type THabitCheckIn = z.infer<typeof habitCheckInSchema>
