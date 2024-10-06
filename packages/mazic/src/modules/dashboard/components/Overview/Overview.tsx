import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import snakeCase from 'lodash/snakeCase'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  CheckIcon,
} from '@mazic/ui'

import { useColorMode } from '@mazic/hooks'
import { checkInType, THabit } from '@mazic/modules/habit'
import { pluralize } from '@mazic/utils/pluralize'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

export const description = 'A stacked bar chart with a legend'

const getWeekDates = () => {
  const startOfWeek = dayjs().startOf('isoWeek')
  const endOfWeek = dayjs().endOf('isoWeek')

  const dates = []
  let currentDate = startOfWeek

  while (currentDate.isBefore(endOfWeek) || currentDate.isSame(endOfWeek, 'day')) {
    dates.push(currentDate.format('YYYY-MM-DD'))
    currentDate = currentDate.add(1, 'day')
  }

  return dates
}

const getRangeDates = (type: TChartRange) => {
  switch (type) {
    case 'WEEK':
      return getWeekDates()
    case 'MONTH':
      return Array.from({ length: 30 }, (_, i) =>
        dayjs().subtract(i, 'day').format('YYYY-MM-DD')
      ).reverse()
    case 'YEAR':
      return Array.from({ length: 12 }, (_, i) =>
        dayjs().subtract(i, 'month').format('YYYY-MM-DD')
      ).reverse()
    default:
      return []
  }
}

type TChartRange = 'WEEK' | 'MONTH' | 'YEAR'

interface Props {
  habits: THabit[]
  range: TChartRange
}

interface ChartItem {
  date: string
  [key: string]: number | string
}

export function Overview({ habits, range }: Props) {
  const getColor = useColorMode
  const chartConfig = habits.reduce((acc, habit) => {
    acc[snakeCase(habit.title)] = {
      label: habit.title,
      color: getColor(habit.color).colorMode,
    }
    return acc
  }, {} as ChartConfig)
  const habitMap = new Map(habits.map((habit) => [snakeCase(habit.title), habit]))

  const chartData = getRangeDates(range).map((date) => {
    const item: ChartItem = { date }
    for (const habit of habits) {
      const _title = snakeCase(habit.title)
      item[_title] = 0
      for (const entry of habit.entries) {
        const entryDate = dayjs(entry.date).format('YYYY-MM-DD')
        if (entryDate === date) {
          item[_title] += entry.bar_value
        }
      }
      item[_title] = item[_title].toFixed(2)
    }
    return item
  })

  const lastIndex = chartData.reduce((lastIndex, item, index) => {
    const hasValue = Object.keys(item).some((key) => key !== 'date' && +item[key] > 0)
    return hasValue ? index : lastIndex
  }, -1)

  const totalHasValue = chartData.reduce((total, item) => {
    return total + (Object.keys(item).some((key) => key !== 'date' && +item[key] > 0) ? 1 : 0)
  }, 0)
  const percentage = Math.round((totalHasValue / chartData.length) * 100)

  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>You are almost there</CardTitle>
        <CardDescription>{percentage}% goals completed</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => dayjs(value).format('MMM DD')}
            />
            {Object.keys(chartConfig).map((key) => {
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={chartConfig[key as keyof typeof chartConfig]?.color}
                  radius={0}
                />
              )
            })}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => dayjs(value).format('MMM D, YYYY')}
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            '--color-bg': `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      {habitMap.get(name as string)?.check_in_type === checkInType.NUMBER && (
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value}
                          <span className="ml-1 font-normal text-muted-foreground">
                            {pluralize(habitMap.get(name as string)?.metric, Number(value))}
                          </span>
                        </div>
                      )}
                      {habitMap.get(name as string)?.check_in_type !== checkInType.NUMBER &&
                        Number(value) > 0 && (
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            <CheckIcon />
                          </div>
                        )}
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={lastIndex}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
