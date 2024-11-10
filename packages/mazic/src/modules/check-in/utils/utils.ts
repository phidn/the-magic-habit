import { CheckboxIcon, NumberIcon } from '@mazic/ui'

import { IOption } from '@mazic/types/form'

export enum checkInType {
  INPUT_NUMBER = 'INPUT_NUMBER',
  DONE_NOTE = 'DONE_NOTE',
  DONE = 'DONE',
}

export const checkInOpts: IOption[] = [
  { value: checkInType.INPUT_NUMBER, label: 'Input Number', icon: NumberIcon },
  { value: checkInType.DONE_NOTE, label: 'Done with Note', icon: CheckboxIcon },
  { value: checkInType.DONE, label: 'Mark Done', icon: CheckboxIcon },
]

export const checkInMap = new Map(checkInOpts.map((opt) => [opt.value, opt]))
