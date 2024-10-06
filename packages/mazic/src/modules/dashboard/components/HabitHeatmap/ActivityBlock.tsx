import { SVGProps } from 'react'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@mazic/design-system'

import { HeatMapExtended, HeatMapValue } from '@mazic/components/HeatMap'
import { habitApis } from '@mazic/modules/habit/apis'
import { THabit, THabitCheckIn } from '@mazic/modules/habit/validations'
import { useStoreShallow } from '@mazic/store/useStore'
import { pluralize } from '@mazic/utils/pluralize'

import { FormCheckIn } from '../FormCheckIn/FormCheckIn'

dayjs.extend(advancedFormat)

interface Props {
  svgProps: SVGProps<SVGRectElement>
  data: HeatMapValue & HeatMapExtended
  color: string
  habit: THabit
  rx: number
  isNumberCheckIn: boolean
  refetch: () => void
}

export const ActivityBlock = (props: Props) => {
  const { svgProps, data, habit, color, rx, refetch, isNumberCheckIn } = props
  const activityDate = dayjs(data.date, 'YYYY/MM/DD')
  const dateFormat = activityDate.format('MMM Do')
  const _count = data.count || 0
  const metricLabel = _count === 0 ? 'No activity' : `${_count} ${pluralize(habit.metric, _count)}`
  const tooltipContent = isNumberCheckIn
    ? `${metricLabel} on ${dateFormat}.`
    : `Checked-in on ${dateFormat}.`

  const isToday = activityDate.isSame(dayjs(), 'day')

  const [showModal, hideModal] = useStoreShallow((state) => [state.showModal, state.hideModal])

  const checkIn = habitApis.useCheckIn()
  const deleteCheckIn = habitApis.useDeleteCheckIn()

  const handleCheckIn = () => {
    showModal({
      open: true,
      showFooter: false,
      title: habit.title,
      confirmText: 'Check-in',
      body: (
        <FormCheckIn
          habit={habit}
          isNumberCheckIn={isNumberCheckIn}
          checkInEntry={{
            id: data.id,
            habit_id: habit.id as string,
            date: activityDate.toDate(),
            journal: data.journal,
            value: isNumberCheckIn ? data.count : undefined,
            is_done: isNumberCheckIn ? undefined : true,
          }}
          onSubmitForm={async (data: THabitCheckIn) => {
            await checkIn.mutateAsync(data)
            hideModal()
            refetch()
          }}
          onDeleteForm={() => {
            deleteCheckIn.mutate(data.id as string, {
              onSuccess: () => {
                hideModal()
                refetch()
              },
            })
          }}
        />
      ),
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <rect
          {...svgProps}
          style={{
            ...svgProps.style,
            ...(isToday && {
              outline: `1px solid ${color}`,
              outlineOffset: '-1px',
              borderRadius: rx,
            }),
          }}
          onClick={handleCheckIn}
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent align="end" side="right">
          {tooltipContent}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
