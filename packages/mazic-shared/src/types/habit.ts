import { z } from 'zod'

import { ColorName } from '../config/colors'
import { HeatMapValue } from '../types'
import { habitSchema } from '../validations'

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
  color: ColorName
  api_key: string
  check_in_items: TCheckIn[]
  activities: HeatMapValue[]
  meta: {
    avg: number
    max: number
  }
}

export type THabitCreate = THabit
