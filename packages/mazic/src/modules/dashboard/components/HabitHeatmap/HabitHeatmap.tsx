import ActivityCalendar, { Activity, BlockElement, ThemeInput } from 'react-activity-calendar'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { Card, CardContent, CardHeader, CardTitle, TooltipProvider } from '@mazic-design-system'

import { colors, getThemeColor } from '@mazic/config/baseColors'
import { useTheme } from '@mazic/contexts/ThemeProvider'
import { THabit } from '@mazic/modules/habit/validations'

import { ActivityBlock } from './ActivityBlock'

dayjs.extend(advancedFormat)

interface Props {
  habit: THabit
}

export const HabitHeatmap = ({ habit }: Props) => {
  const { title, activities, metric } = habit || {}
  const { mode } = useTheme()

  if (!activities?.length) {
    return null
  }

  const habitColor = getThemeColor(habit?.color)
  const minimalTheme: ThemeInput = {
    light: [colors.slate[1].hex, `hsl(${habitColor?.activeColor.light})`],
    dark: [colors.slate[8].hex, `hsl(${habitColor?.activeColor.dark})`],
  }
  const activeModeColor = `hsl(${habitColor?.activeColor?.[mode]})`

  const renderBlock = (block: BlockElement, activity: Activity) => {
    return (
      <ActivityBlock block={block} activity={activity} color={activeModeColor} metric={metric} />
    )
  }

  return (
    <div className="w-full m-2">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <TooltipProvider delayDuration={300}>
            <ActivityCalendar
              colorScheme={mode}
              data={activities || []}
              renderBlock={renderBlock}
              hideTotalCount
              showWeekdayLabels
              theme={minimalTheme}
              blockSize={15}
            />
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}
