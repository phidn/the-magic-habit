import { SVGProps, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { checkInType, HeatMapValue, THabit, THabitCheckIn } from '@mazic/shared'
import { useStoreShallow } from '@mazic/store/useStore'
import { pluralize } from '@mazic/utils/pluralize'

import { useCheckIn, useDeleteCheckIn } from '../../hooks/useCheckInApis'
import { FormCheckIn } from '../FormCheckIn/FormCheckIn'

dayjs.extend(advancedFormat)

interface Props {
  svgProps: SVGProps<SVGRectElement>
  data: HeatMapValue
  color: string
  habit: THabit | undefined
  rx: number
  scrollToToday?: boolean
  panelColors?: Record<number, string>
  refetch: () => void
  onDelete?: (id: string) => void
}

export const ActivityBlock = (props: Props) => {
  const checkIn = useCheckIn()
  const deleteCheckIn = useDeleteCheckIn()

  const [hideModal, showModal] = useStoreShallow((state) => [state.hideModal, state.showModal])

  const { svgProps, data, habit, color, panelColors, rx, refetch, scrollToToday, onDelete } = props
  const [activityData, setActivityData] = useState<HeatMapValue>(data)
  const [isActivityDone, setIsActivityDone] = useState<boolean>(!!data.is_done)

  const activityDate = dayjs(data.date, 'YYYY/MM/DD')
  const dateFormat = activityDate.format('MMM Do')

  const isToday = activityDate.isSame(dayjs(), 'day')
  const ref = useRef<SVGRectElement>(null)
  const isNumberCheckIn = habit?.check_in_type === checkInType.INPUT_NUMBER
  const isMarkDone = habit?.check_in_type === checkInType.DONE

  useEffect(() => {
    if (isToday && scrollToToday) {
      ref.current?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
      })
    }
  }, [isToday, scrollToToday])

  const handleCheckIn = async () => {
    if (isMarkDone) {
      const isDone = !isActivityDone
      const { data: _data } = await checkIn.mutateAsync({
        id: activityData.id,
        habit_id: habit.id as string,
        date: activityDate.toDate(),
        journal: '',
        value: undefined,
        is_done: isDone,
      })
      const _id = _data?.data?.id
      if (_id) {
        setIsActivityDone(isDone)
        setActivityData((prev) => ({ ...prev, id: _id }))
      }
    }
    if (!isMarkDone) {
      showModal({
        open: true,
        showFooter: false,
        title: `${habit?.title || ''} Check-In`,
        body: habit && (
          <FormCheckIn
            habit={habit}
            checkInEntry={{
              id: data.id,
              habit_id: habit.id as string,
              date: activityDate.toDate(),
              journal: data.journal,
              value: isNumberCheckIn ? data.count : undefined,
              is_done: isNumberCheckIn ? undefined : true,
            }}
            onSubmitForm={async (data: THabitCheckIn) => {
              await checkIn.mutateAsync(data, {
                onSuccess: () => {
                  hideModal()
                  refetch()
                },
              })
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
        ...(isMarkDone && {
          fill: isActivityDone ? panelColors?.[4] : panelColors?.[0],
        }),
      }}
      onClick={handleCheckIn}
      data-tooltip-id={`my-tooltip-${habit?.id}`}
      data-tooltip-content={renderTooltip()}
    />
  )
}
