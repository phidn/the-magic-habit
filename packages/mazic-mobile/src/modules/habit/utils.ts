import dayjs from 'dayjs'

import { checkInType, HeatMapValue, TCheckIn, THabit } from '@mazic/shared'

import { IOption } from '@/types/types'

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

export const checkInOpts: IOption[] = [
  { value: checkInType.INPUT_NUMBER, label: 'Input Number', icon: '' },
  { value: checkInType.DONE_NOTE, label: 'Done with Note', icon: '' },
  { value: checkInType.DONE, label: 'Mark Done', icon: '' },
]

export const checkInMap = new Map(checkInOpts.map((opt) => [opt.value, opt]))
