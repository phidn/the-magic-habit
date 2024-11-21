import dayjs from 'dayjs'

import { HeatMapValue, TCheckIn, THabit } from '@mazic/shared'

export const normalizeHabitData = (data: THabit[]): THabit[] => {
  return data.map((item) => ({
    ...item,
    activities: getActivities(item.check_in_items),
  }))
}

export const getActivities = (data?: TCheckIn[]): HeatMapValue[] => {
  return (data || []).map((entry) => ({
    id: entry.id,
    date: dayjs(entry.date).format('YYYY/MM/DD'),
    count: entry.count,
    level: entry.level,
    journal: entry.journal,
    is_done: entry.is_done,
  }))
}
