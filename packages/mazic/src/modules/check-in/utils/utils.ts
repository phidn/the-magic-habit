import { CheckboxIcon, NumberIcon } from '@mazic/ui'

import { IOption } from '@mazic/types/form'

export enum checkInType {
  NUMBER = 'NUMBER',
  CHECKBOX = 'CHECKBOX',
}

export const checkInOpts: IOption[] = [
  { value: checkInType.NUMBER, label: 'Number', icon: NumberIcon },
  { value: checkInType.CHECKBOX, label: 'Checkbox', icon: CheckboxIcon },
]

export const checkInMap = new Map(checkInOpts.map((opt) => [opt.value, opt]))
