import { SVGProps, useEffect, useRef } from 'react'
import { useMatch } from 'react-router-dom'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@mazic/ui'

import { HeatMapExtended, HeatMapValue } from '@mazic/components/HeatMap'
import { THabit } from '@mazic/modules/habit'
import { useStoreShallow } from '@mazic/store/useStore'
import { pluralize } from '@mazic/utils/pluralize'

import { useCheckIn, useDeleteCheckIn } from '../../hooks/apis'
import { THabitCheckIn } from '../../utils/validations'
import { FormCheckIn } from '../FormCheckIn/FormCheckIn'

dayjs.extend(advancedFormat)

interface Props {
  svgProps: SVGProps<SVGRectElement>
  data: HeatMapValue & HeatMapExtended
  color: string
  habit: THabit
  rx: number
  isNumberCheckIn: boolean
  isWidget: boolean
  refetch: () => void
}

export const ActivityBlock = (props: Props) => {
  const [showModal, hideModal] = useStoreShallow((state) => [state.showModal, state.hideModal])
  const checkIn = useCheckIn()
  const deleteCheckIn = useDeleteCheckIn()

  const { svgProps, data, habit, color, rx, refetch, isNumberCheckIn, isWidget } = props

  const activityDate = dayjs(data.date, 'YYYY/MM/DD')
  const dateFormat = activityDate.format('MMM Do')
  const _count = data.count || 0
  const metricLabel = _count === 0 ? 'No activity' : `${_count} ${pluralize(habit.metric, _count)}`
  const tooltipContent = isNumberCheckIn
    ? `${metricLabel} on ${dateFormat}.`
    : `Checked-in on ${dateFormat}.`

  const isToday = activityDate.isSame(dayjs(), 'day')
  const ref = useRef<SVGRectElement>(null)

  useEffect(() => {
    if (isToday && isWidget) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      })
    }
  }, [isToday, isWidget])

  const handleCheckIn = () => {
    showModal({
      open: true,
      showFooter: false,
      title: `${habit.title} Check-In`,
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
          ref={ref}
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
