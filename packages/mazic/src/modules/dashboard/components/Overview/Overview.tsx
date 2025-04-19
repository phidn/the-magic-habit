import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import snakeCase from 'lodash/snakeCase'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mazic/ui'
import { baseColorMap, ColorName } from '@mazic/shared'
import { checkInType, THabit } from '@mazic/shared'
import { ChartType } from '@mazic/store/slices/userSlice'
import { useStoreShallow } from '@mazic/store/useStore'
import { pluralize } from '@mazic/utils/pluralize'

import { getRangeDates, TChartRange } from '../../utils'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

interface Props {
  habits: THabit[]
  range: TChartRange
  isLoading?: boolean
}

interface ChartItem {
  date: string
  [key: string]: number | string
}

export function Overview({ habits, range, isLoading }: Props) {
  const [mode, chartType, setChartType] = useStoreShallow((state) => [
    state.theme.mode,
    state.chartType,
    state.setChartType,
  ])

  const chartConfig = habits.reduce((acc, habit) => {
    const _color = baseColorMap.get(habit.color as ColorName)
    acc[snakeCase(habit.title)] = {
      label: habit.title,
      color: _color ? `hsl(${_color?.activeColor?.[mode]})` : 'var(--primary)',
    }
    return acc
  }, {} as ChartConfig)
  const habitMap = new Map(habits.map((habit) => [snakeCase(habit.title), habit]))

  const chartData = getRangeDates(range).map((date) => {
    const item: ChartItem = { date }
    for (const habit of habits) {
      const _title = snakeCase(habit.title)
      item[_title] = 0
      for (const entry of habit.check_in_items) {
        const entryDate = dayjs(entry.date).format('YYYY-MM-DD')
        if (entryDate === date) {
          item[_title] += entry.bar_value
          item[`actual_${_title}`] = entry.value
        }
      }
      item[_title] = item[_title].toFixed(2)
      item[`actual_${_title}`] = (+item[`actual_${_title}`] || 0).toFixed(2)
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

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart accessibilityLayer data={chartData}>
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
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartConfig[key as keyof typeof chartConfig]?.color}
                  activeDot={{ r: 6 }}
                />
              )
            })}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => dayjs(value).format('MMM D, YYYY')}
                  formatter={(value, name, item) => {
                    const _value = item.payload[`actual_${name}`]
                    return (
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
                        {habitMap.get(name as string)?.check_in_type ===
                          checkInType.INPUT_NUMBER && (
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {_value}
                            <span className="ml-1 font-normal text-muted-foreground">
                              {pluralize(habitMap.get(name as string)?.metric, Number(_value))}
                            </span>
                          </div>
                        )}
                        {habitMap.get(name as string)?.check_in_type !== checkInType.INPUT_NUMBER &&
                          Number(value) > 0 && (
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              <CheckIcon />
                            </div>
                          )}
                      </>
                    )
                  }}
                />
              }
              cursor={false}
              defaultIndex={lastIndex}
            />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart accessibilityLayer data={chartData}>
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
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  fill={chartConfig[key as keyof typeof chartConfig]?.color}
                  stroke={chartConfig[key as keyof typeof chartConfig]?.color}
                />
              )
            })}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => dayjs(value).format('MMM D, YYYY')}
                  formatter={(value, name, item) => {
                    const _value = item.payload[`actual_${name}`]
                    return (
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
                        {habitMap.get(name as string)?.check_in_type ===
                          checkInType.INPUT_NUMBER && (
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {_value}
                            <span className="ml-1 font-normal text-muted-foreground">
                              {pluralize(habitMap.get(name as string)?.metric, Number(_value))}
                            </span>
                          </div>
                        )}
                        {habitMap.get(name as string)?.check_in_type !== checkInType.INPUT_NUMBER &&
                          Number(value) > 0 && (
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              <CheckIcon />
                            </div>
                          )}
                      </>
                    )
                  }}
                />
              }
              cursor={false}
              defaultIndex={lastIndex}
            />
          </AreaChart>
        )
      default:
        return (
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
                  formatter={(value, name, item) => {
                    const _value = item.payload[`actual_${name}`]
                    return (
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
                        {habitMap.get(name as string)?.check_in_type ===
                          checkInType.INPUT_NUMBER && (
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {_value}
                            <span className="ml-1 font-normal text-muted-foreground">
                              {pluralize(habitMap.get(name as string)?.metric, Number(_value))}
                            </span>
                          </div>
                        )}
                        {habitMap.get(name as string)?.check_in_type !== checkInType.INPUT_NUMBER &&
                          Number(value) > 0 && (
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              <CheckIcon />
                            </div>
                          )}
                      </>
                    )
                  }}
                />
              }
              cursor={false}
              defaultIndex={lastIndex}
            />
          </BarChart>
        )
    }
  }

  return (
    <Card className="h-[350px]">
      <CardHeader isLoading={isLoading} className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>You are almost there</CardTitle>
          <CardDescription>{percentage}% goals completed</CardDescription>
        </div>
        <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent isLoading={isLoading}>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          {renderChart()}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
