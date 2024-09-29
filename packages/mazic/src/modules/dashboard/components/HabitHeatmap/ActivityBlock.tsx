import { useState } from 'react'
import { Activity, BlockElement } from 'react-activity-calendar'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@mazic-design-system'

import { useStore } from '@mazic/store/useStore'
import { pluralize } from '@mazic/utils/pluralize'

dayjs.extend(advancedFormat)

interface Props {
  block: BlockElement
  activity: Activity
  metric: string
  color: string
}

export const ActivityBlock = ({ block, activity, metric, color }: Props) => {
  const dateFormat = dayjs(activity.date, 'YYYY-MM-DD').format('MMMM Do')
  const metricLabel =
    activity.count === 0 ? 'No activity' : `${activity.count} ${pluralize(metric, activity.count)}`
  const tooltipContent = `${metricLabel} on ${dateFormat}.`

  const isToday = dayjs().isSame(dayjs(activity.date), 'day')
  const [isActive, setIsActive] = useState(false)
  const setModal = useStore((state) => state.setModal)

  return (
    <Tooltip>
      <TooltipTrigger
        asChild
        style={{
          ...((isToday || isActive) && {
            stroke: 'unset',
            strokeWidth: 'unset',
            outline: `1px solid ${color}`,
            outlineOffset: '-1px',
            border: 'none',
            borderRadius: '0.2rem',
          }),
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onClick={() => {
          console.log('child click activity:', activity)
          setModal({
            open: true,
            title: 'Delete item',
          })
        }}
      >
        {block}
      </TooltipTrigger>
      <TooltipPortal>{isActive && <TooltipContent>{tooltipContent}</TooltipContent>}</TooltipPortal>
    </Tooltip>
  )
}
