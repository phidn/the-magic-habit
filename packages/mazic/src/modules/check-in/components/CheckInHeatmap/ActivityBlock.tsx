import { SVGProps, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { HeatMapValue } from '@mazic/components/HeatMap'
import { TModal } from '@mazic/store/slices/modalSlice'
import { THabit } from '@mazic/types/modules'
import { pluralize } from '@mazic/utils/pluralize'

import { useCheckIn, useDeleteCheckIn } from '../../hooks/useCheckInApis'
import { checkInType } from '../../utils/utils'
import { THabitCheckIn } from '../../utils/validations'
import { FormCheckIn } from '../FormCheckIn/FormCheckIn'

dayjs.extend(advancedFormat)

interface Props {
  svgProps: SVGProps<SVGRectElement>
  data: HeatMapValue
  color: string
  habit: THabit | undefined
  rx: number
  scrollToToday?: boolean
  refetch: () => void
  onDelete?: (id: string) => void
  hideModal: () => void
  showModal: (modal: Partial<TModal>) => void
}

export const ActivityBlock = (props: Props) => {
  const checkIn = useCheckIn()
  const deleteCheckIn = useDeleteCheckIn()

  const {
    svgProps,
    data,
    habit,
    color,
    rx,
    refetch,
    scrollToToday,
    onDelete,
    hideModal,
    showModal,
  } = props

  const activityDate = dayjs(data.date, 'YYYY/MM/DD')
  const dateFormat = activityDate.format('MMM Do')

  const isToday = activityDate.isSame(dayjs(), 'day')
  const ref = useRef<SVGRectElement>(null)
  const isNumberCheckIn = habit?.check_in_type === checkInType.INPUT_NUMBER

  useEffect(() => {
    if (isToday && scrollToToday) {
      ref.current?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
      })
    }
  }, [isToday, scrollToToday])

  const handleCheckIn = () => {
    showModal({
      open: true,
      showFooter: false,
      title: `${habit?.title || ''} Check-In`,
      body: habit && (
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
                onDelete?.(data.id as string)
              },
            })
          }}
        />
      ),
    })
  }

  const _count = data.count || 0

  const renderTooltip = () => {
    if (habit?.check_in_type === checkInType.INPUT_NUMBER) {
      const _label = !_count ? 'No activity' : `${_count} ${pluralize(habit?.metric, _count)}`
      return `${_label} on ${dateFormat}.`
    } else {
      const _label = !_count ? 'No activity' : 'Completed successfully'
      return `${_label} on ${dateFormat}.`
    }
  }

  return (
    <rect
      ref={isToday && scrollToToday ? ref : undefined}
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
      data-tooltip-id={`my-tooltip-${habit?.id}`}
      data-tooltip-content={renderTooltip()}
    />
  )
}
