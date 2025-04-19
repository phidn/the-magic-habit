import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import snakeCase from 'lodash/snakeCase'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'

import {
  Button,
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
import { baseColorMap, checkInType, ColorName, THabit } from '@mazic/shared'
import { useColorMode } from '@mazic/hooks'
import { ChartType } from '@mazic/store/slices/userSlice'
import { useStoreShallow } from '@mazic/store/useStore'
import { pluralize } from '@mazic/utils/pluralize'

import { getRangeDates, TChartRange } from '../../utils'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

interface Props {
  habits: THabit[]
  isLoading?: boolean
}

interface ChartItem {
  date: string
  [key: string]: number | string
}

export function Overview({ habits, isLoading }: Props) {
  const { pathname } = useLocation()

  const [mode, _chartType, setChartType, chartRange, setChartRange] = useStoreShallow((state) => [
    state.theme.mode,
    state.chartType,
    state.setChartType,
    state.chartRange,
    state.setChartRange,
  ])

  // Check if we have exactly one habit with MULTI_CRITERIA type
  const isMultiCriteriaView =
    habits.length === 1 && habits[0].check_in_type === checkInType.MULTI_CRITERIA
  const singleHabit = habits.length === 1 ? habits[0] : null

  const chartType = _chartType?.[pathname] || (isMultiCriteriaView ? 'biaxial' : 'bar')

  const { adjustColor } = useColorMode(singleHabit?.color)

  const chartConfig = habits.reduce((acc, habit) => {
    const _color = baseColorMap.get(habit.color as ColorName)
    acc[snakeCase(habit.title)] = {
      label: habit.title,
      color: _color ? `hsl(${_color?.activeColor?.[mode]})` : 'var(--primary)',
    }
    return acc
  }, {} as ChartConfig)

  // For MULTI_CRITERIA view, create a config for each criterion
  const criteriaChartConfig =
    isMultiCriteriaView && singleHabit?.criterions
      ? singleHabit.criterions.reduce((acc, criterion, index) => {
          acc[snakeCase(criterion.name)] = {
            label: criterion.name,
            color: adjustColor(((singleHabit.criterions?.length || 0) - index) * 10),
          }
          return acc
        }, {} as ChartConfig)
      : {}

  const habitMap = new Map(habits.map((habit) => [snakeCase(habit.title), habit]))

  const chartData = getRangeDates(chartRange).map((date) => {
    const item: ChartItem = { date }
    for (const habit of habits) {
      const _title = snakeCase(habit.title)
      item[_title] = 0
      for (const entry of habit.check_in_items) {
        const entryDate = dayjs(entry.date).format('YYYY-MM-DD')
        if (entryDate === date) {
          item[_title] += entry.bar_value
          item[`actual_${_title}`] = entry.value

          // For MULTI_CRITERIA, add each criterion's value
          if (habit.check_in_type === checkInType.MULTI_CRITERIA && entry.criterion_values) {
            entry.criterion_values.forEach((cv) => {
              const criterion = habit.criterions?.find((c) => c.id === cv.criterion_id)
              if (criterion) {
                const criterionKey = snakeCase(criterion.name)
                item[criterionKey] = cv.value
              }
            })
          }
        }
      }
      item[_title] = parseFloat(item[_title].toFixed(2))
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
    // Special case for MULTI_CRITERIA with BiaxialBarChart
    if (isMultiCriteriaView && chartType === 'biaxial' && singleHabit?.criterions) {
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
          <YAxis axisLine={false} tickLine={false} width={30} />
          {singleHabit.criterions.map((criterion, index) => {
            const criterionKey = snakeCase(criterion.name)
            return (
              <Bar
                key={criterionKey}
                dataKey={criterionKey}
                name={criterion.name}
                fill={criteriaChartConfig[criterionKey]?.color}
                radius={0}
              />
            )
          })}
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => dayjs(value).format('MMM D, YYYY')}
                formatter={(value, name) => {
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
                      {criteriaChartConfig[name as keyof typeof criteriaChartConfig]?.label || name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                      </div>
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
            <YAxis axisLine={false} tickLine={false} width={30} />
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
            <YAxis axisLine={false} tickLine={false} width={30} />
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
            <YAxis axisLine={false} tickLine={false} width={30} />
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

  const handleRangeChange = (newRange: TChartRange) => {
    if (setChartRange) {
      setChartRange(newRange)
    }
  }

  return (
    <Card className="h-[350px]">
      <CardHeader isLoading={isLoading} className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>You are almost there</CardTitle>
          <CardDescription>{percentage}% goals completed</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={chartRange === 'WEEK' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => handleRangeChange('WEEK')}
            >
              Weekly
            </Button>
            <Button
              variant={chartRange === 'MONTH' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => handleRangeChange('MONTH')}
            >
              Monthly
            </Button>
          </div>
          <Select
            value={chartType}
            onValueChange={(value) => setChartType(value as ChartType, pathname)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Chart type" />
            </SelectTrigger>
            <SelectContent>
              {isMultiCriteriaView && <SelectItem value="biaxial">Skill Breakdown</SelectItem>}
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent isLoading={isLoading}>
        <ChartContainer
          config={
            isMultiCriteriaView && chartType === 'biaxial' ? criteriaChartConfig : chartConfig
          }
          className="h-[200px] w-full"
        >
          {renderChart()}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
