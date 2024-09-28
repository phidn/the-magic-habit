import { Activity } from 'react-activity-calendar'
import { z } from 'zod'

const habitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  metric: z.string().min(1, 'Metric is required'),
  week_start: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  order: z.number().optional(),
  user_id: z.string().optional(),
  is_deleted: z.boolean().optional(),
  is_private: z.boolean().optional(),
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
  entries: THabitEntry[]
  activities: Activity[]
}
