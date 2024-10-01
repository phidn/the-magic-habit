import { SVGProps } from 'react'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@mazic-design-system'

import { HeatMapValue } from '@mazic/components/HeatMap'
import { pluralize } from '@mazic/utils/pluralize'

dayjs.extend(advancedFormat)

interface Props {
  svgProps: SVGProps<SVGRectElement>
  data: HeatMapValue & {
    column: number
    row: number
    index: number
  }
  metric: string
  color: string
  rx: number
}

export const ActivityBlock = ({ svgProps, data, metric, color, rx }: Props) => {
  const activityDate = dayjs(data.date, 'YYYY/MM/DD')
  const dateFormat = activityDate.format('MMMM Do')
  const _count = data.count || 0
  const metricLabel = _count === 0 ? 'No activity' : `${_count} ${pluralize(metric, _count)}`
  const tooltipContent = `${metricLabel} on ${dateFormat}.`

  const isToday = activityDate.isSame(dayjs(), 'day')

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
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
