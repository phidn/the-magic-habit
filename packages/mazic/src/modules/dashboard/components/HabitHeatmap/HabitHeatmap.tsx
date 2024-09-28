import ActivityCalendar, { Activity, BlockElement, ThemeInput } from 'react-activity-calendar'
import * as Tooltip from '@radix-ui/react-tooltip'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Card, CardContent, CardHeader, CardTitle } from '@mazic-design-system'

import { pluralize } from '@mazic/utils/pluralize'

import { THabit } from '../../validations'
dayjs.extend(advancedFormat)

interface Props {
  habit: THabit
}

export const HabitHeatmap = ({ habit }: Props) => {
  const { title, activities, metric } = habit || {}
  if (!activities?.length) {
    return null
  }

  const renderBlock = (block: BlockElement, activity: Activity) => {
    const dateFormat = dayjs(activity.date, 'YYYY-MM-DD').format('MMMM Do')
    const metricLabel =
      activity.count === 0
        ? 'No activity'
        : `${activity.count} ${pluralize(metric, activity.count)}`
    const tooltipContent = `${metricLabel} on ${dateFormat}`

    const isToday = dayjs().isSame(dayjs(activity.date), 'day')
    const style = isToday ? { stroke: 'var(--gray-500)' } : {}

    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild style={style}>
          {block}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
            {tooltipContent}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    )
  }

  const minimalTheme: ThemeInput = {
    light: ['hsl(0, 0%, 92%)', 'red'],
  }

  return (
    <div className="w-full m-2">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Tooltip.Provider delayDuration={100}>
            <ActivityCalendar
              data={activities || []}
              colorScheme="light"
              renderBlock={renderBlock}
              hideTotalCount
              showWeekdayLabels
              theme={minimalTheme}
              blockSize={15}
            />
          </Tooltip.Provider>
        </CardContent>
      </Card>
    </div>
  )
}
