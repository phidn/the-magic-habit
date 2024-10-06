import dayjs from 'dayjs'

import { THabit } from './validations'

export const normalizeHabitData = (data: THabit[]): THabit[] => {
  return data.map((item) => ({
    ...item,
    activities: (item.entries || []).map((entry) => ({
      id: entry.id,
      date: dayjs(entry.date).format('YYYY/MM/DD'),
      count: entry.count,
      level: entry.level,
      journal: entry.journal,
      is_done: entry.is_done,
    })),
  }))
}
