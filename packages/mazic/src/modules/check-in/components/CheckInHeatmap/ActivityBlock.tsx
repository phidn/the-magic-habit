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
    const initJournal = data?.id
      ? data.journal
      : (habit?.template || '')?.length > 0
        ? habit?.template || ''
        : ''

    if (isMarkDone) {
      const isDone = !isActivityDone
      const { data: _data } = await checkIn.mutateAsync({
        id: activityData.id,
        habit_id: habit.id as string,
        date: activityDate.toDate(),
        journal: initJournal,
        value: undefined,
        is_done: isDone,
      })
      const _id = _data?.data?.id
      if (_id) {
        setIsActivityDone(isDone)
        setActivityData((prev) => ({ ...prev, id: _id }))
      }
      return
    }

    if (!isMarkDone) {
      const checkInEntry: THabitCheckIn = {
        id: data.id,
        habit_id: habit?.id as string,
        date: activityDate.toDate(),
        journal: initJournal,
        value: isNumberCheckIn ? data.count : undefined,
        is_done: isNumberCheckIn ? undefined : true,
        criterion_values: data.criterion_values,
      }

      if (habit?.check_in_type === checkInType.MULTI_CRITERIA) {
        if (!checkInEntry?.id) {
          checkInEntry.criterion_values = (habit.criterions || []).map((criterion) => ({
            criterion_id: criterion.id as string,
            value: 0,
          }))
          checkInEntry.value = 0
        } else {
          checkInEntry.criterion_values = (habit.criterions || []).map((criterion) => {
            const criterionValue = (checkInEntry.criterion_values || []).find(
              (cv) => cv.criterion_id === criterion.id
            )
            return {
              criterion_id: criterion.id as string,
              value: criterionValue?.value || 0,
            }
          })
          checkInEntry.value = 0
        }
      }

      showModal({
        open: true,
        showFooter: false,
        title: `${habit?.title || ''} Check-In`,
        body: habit && (
          <FormCheckIn
            habit={habit}
            checkInEntry={checkInEntry}
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
      return
    }
  }

  const renderTooltip = () => {
    const _count = data.count || 0
    let activityInfo = ''
    const tooltipStyles = {
      container: 'padding: 10px; max-width: 250px;',
      header: 'font-weight: bold; margin-bottom: 8px; font-size: 1.05em;',
      progress: 'display: flex; align-items: center; margin: 5px 0; gap: 8px;',
      progressBar:
        'height: 6px; border-radius: 3px; background: rgba(255,255,255,0.2); width: 100%;',
      progressFill: `height: 100%; border-radius: 3px; background: ${color};`,
      journal: 'border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px;',
      journalLabel: 'color: #aaa; font-size: 0.9em; margin-bottom: 4px;',
      criteria: 'margin-top: 6px; padding-left: 5px; border-left: 2px solid rgba(255,255,255,0.1);',
      criteriaItem: 'display: flex; justify-content: space-between; margin: 3px 0;',
    }

    // Date formatting
    const tooltipDate = activityDate.format('MMM Do, YYYY')

    // Build header info
    if (habit?.check_in_type === checkInType.INPUT_NUMBER) {
      const _label = !_count ? 'No activity' : `${_count} ${pluralize(habit?.metric, _count)}`
      activityInfo = `${_label} on ${tooltipDate}`
    } else if (habit?.check_in_type === checkInType.MULTI_CRITERIA) {
      activityInfo = !_count
        ? `No activity on ${tooltipDate}`
        : `${_count} points on ${tooltipDate}`
    } else {
      const _label = !_count ? 'No activity' : 'Completed successfully'
      activityInfo = `${_label} on ${tooltipDate}`
    }

    // Start building the tooltip
    let tooltipContent = `<div style="${tooltipStyles.container}">
      <div style="${tooltipStyles.header}">${activityInfo}</div>`

    // Add progress visualization for numeric goals
    if (habit?.check_in_type === checkInType.INPUT_NUMBER && habit?.goal_number && _count > 0) {
      const goalNumber = Number(habit.goal_number || 0)
      const percentage = Math.min(100, (_count / goalNumber) * 100)

      tooltipContent += `<div style="${tooltipStyles.progress}">
        <div style="${tooltipStyles.progressBar}">
          <div style="${tooltipStyles.progressFill}width: ${percentage}%;"></div>
        </div>
        ${percentage.toFixed(0)}%
      </div>`
    }

    // Add multi-criteria details
    if (habit?.check_in_type === checkInType.MULTI_CRITERIA && data.criterion_values?.length) {
      tooltipContent += `<div style="${tooltipStyles.criteria}">`

      habit.criterions?.forEach((criterion) => {
        const criterionValue = data.criterion_values?.find((cv) => cv.criterion_id === criterion.id)
        const value = criterionValue?.value || 0
        const percentage = criterion.goal_number
          ? Math.min(100, (value / criterion.goal_number) * 100)
          : 0

        tooltipContent += `<div style="${tooltipStyles.criteriaItem}">
          <span>${criterion.name}: ${value}/${criterion.goal_number}</span>
          <span>${percentage.toFixed(0)}%</span>
        </div>`
      })

      tooltipContent += `</div>`
    }

    // Add journal content if available
    if (data?.journal && !habit?.template) {
      tooltipContent += `<div style="${tooltipStyles.journal}">
        <div style="${tooltipStyles.journalLabel}">Journal:</div>
        <div>${data.journal}</div>
      </div>`
    }

    tooltipContent += `</div>`
    return tooltipContent
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
      data-tooltip-html={renderTooltip()}
    />
  )
}
