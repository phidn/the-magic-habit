import { CheckboxIcon, NumberIcon } from '@mazic/ui'
import { checkInType } from '@mazic/shared'
import { IOption } from '@mazic/types/form'

export const checkInOpts: IOption[] = [
  { value: checkInType.INPUT_NUMBER, label: 'Input Number', icon: NumberIcon },
  { value: checkInType.MULTI_CRITERIA, label: 'Multiple Criteria', icon: NumberIcon },
  { value: checkInType.DONE, label: 'Mark Done', icon: CheckboxIcon },
  { value: checkInType.DONE_NOTE, label: 'Done with Journal', icon: CheckboxIcon },
]

export const checkInMap = new Map(checkInOpts.map((opt) => [opt.value, opt]))
