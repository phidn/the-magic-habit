import dayjs from 'dayjs'
import { z } from 'zod'

type HeatMapValue = {
  date: string
  content?: string | string[] | React.ReactNode
  count: number

  id: string
  column?: number
  row?: number
  index?: number
  level: number
  journal: string
  is_done?: boolean
}

export enum checkInType {
  NUMBER = 'NUMBER',
  CHECKBOX = 'CHECKBOX',
}

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

export type TCheckIn = {
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
  color: string // ColorName
  api_key: string
  check_in_items: TCheckIn[]
  activities: HeatMapValue[]
  meta: {
    avg: number
    max: number
  }
}

export type THabitCreate = THabit

export const normalizeHabitData = (data: THabit[]): THabit[] => {
  return data.map((item) => ({
    ...item,
    activities: getActivities(item.check_in_items),
  }))
}

export const getActivities = (data?: TCheckIn[]): HeatMapValue[] => {
  const result = (data || []).map((entry) => ({
    id: entry.id,
    date: dayjs(entry.date).format('YYYY-MM-DD'),
    count: entry.count,
    level: entry.level,
    journal: entry.journal,
    is_done: entry.is_done,
  }))

  if (result.find((entry) => dayjs(entry.date).isSame(dayjs(), 'day')) === undefined) {
    result.push({
      date: dayjs().format('YYYY-MM-DD'),
      count: -1,
      level: 0,
      journal: '',
      id: '',
      is_done: false,
    })
  }

  return result
}
