import dayjs from 'dayjs'

import { CheckboxIcon, NumberIcon } from '@mazic/ui'

import { IOption } from '@mazic/types/form'

import { THabit } from './validations'

export enum checkInType {
  NUMBER = 'NUMBER',
  CHECKBOX = 'CHECKBOX',
}

export const checkInOpts: IOption[] = [
  { value: checkInType.NUMBER, label: 'Number', icon: NumberIcon },
  { value: checkInType.CHECKBOX, label: 'Checkbox', icon: CheckboxIcon },
]

export const checkInMap = new Map(checkInOpts.map((opt) => [opt.value, opt]))

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
