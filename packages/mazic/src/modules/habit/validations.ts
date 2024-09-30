import { Activity } from 'react-activity-calendar'
import { z } from 'zod'

import { ColorName } from '@mazic/config/baseColors'

export const habitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  metric: z.string().min(1, 'Metric is required'),
  week_start: z.string().optional().default('MONDAY'),
  color: z.string().min(1, 'Color is required').default('blue'),
  order: z.number().optional().default(0),
  is_private: z.boolean().optional().default(true),
})

type THabitEntry = {
  id: string
  date: string
  value: number
  journal: string
  habit_id: string
  level: number
  count: number
}

export type THabit = z.infer<typeof habitSchema> & {
  color: ColorName
  entries: THabitEntry[]
  activities: Activity[]
}

export type THabitCreate = THabit
