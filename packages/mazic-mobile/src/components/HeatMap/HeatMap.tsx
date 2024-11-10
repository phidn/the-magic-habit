import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'
import { wrapScrollView } from 'react-native-scroll-into-view'
import Svg, { G, Text } from 'react-native-svg'
import Color from 'color'

import { range } from '@/utils/utils'

import { HeatMapSquare } from './HeatMapSquare'
import {
  COLOR_LEVELS,
  DAYS_IN_WEEK,
  getHeight,
  getMonthLabelCoordinates,
  getStartDateWithEmptyDays,
  getTransformForWeek,
  getValueCache,
  getWeekCount,
  getWidth,
  MONTH_LABEL_GUTTER_SIZE,
  shiftDate,
  SQUARE_SIZE,
} from './utils'

export interface IHeatMapProps {
  values: any
  gutterSize?: number
  horizontal?: boolean
  numDays?: number
  endDate?: Date
  titleForValue?: (value: any) => string
  tooltipDataAttrs?: (value: any) => any
  showOutOfRangeDays?: boolean
  showMonthLabels?: boolean
  monthLabelForIndex?: (index: number) => string
  showWeekdayLabels?: boolean
  isHeatMapLevel?: boolean
}

const MyScrollView = wrapScrollView(ScrollView)

export const HeatMap = (props: IHeatMapProps) => {
  const {
    values,
    gutterSize = 1,
    horizontal = true,
    numDays = 91,
    endDate = new Date(),
    titleForValue,
    tooltipDataAttrs,
    showOutOfRangeDays = false,
    showMonthLabels,
    monthLabelForIndex,
    showWeekdayLabels = true,
    isHeatMapLevel = false,
  } = props

  const { t } = useTranslation()
  const { colors, dark } = useTheme()

  const colorArray = COLOR_LEVELS
  const labelColor = colors.onSurface
  const bgColor = dark
    ? Color(colors.surfaceVariant).alpha(0.3).toString()
    : Color(colors.surfaceVariant).alpha(0.5).toString()
  const borderColor = Color.rgb(255, 255, 255).alpha(0.05).toString()

  const monthsShort = t('Time.monthNamesShort').split('_')
  const monthLabels = { ...monthsShort }
  const weekdaysShort = t('Time.dayNamesShort')
    .split('_')
    .map((x) => x.slice(0, 2))
  const valueCache = getValueCache(values, numDays, endDate)

  const findColorLevelByPercent = (percent: number) => {
    if (percent > 0 && percent <= 40) return colorArray[0]
    if (percent > 40 && percent < 60) return colorArray[1]
    if (percent >= 60 && percent < 80) return colorArray[2]
    if (percent > 80) return colorArray[3]
    return bgColor
  }
  const findColorLevel = (level: number) => {
    if (level === 1) return colorArray[0]
    if (level === 2) return colorArray[1]
    if (level === 3) return colorArray[2]
    if (level >= 4) return colorArray[3]
    return bgColor
  }

  const renderSquare = (dayIndex: number, index: number) => {
    return (
      <HeatMapSquare
        numDays={numDays}
        endDate={endDate}
        key={index}
        dayIndex={dayIndex}
        index={index}
        horizontal={horizontal}
        gutterSize={gutterSize}
        valueCache={valueCache}
        titleForValue={titleForValue}
        tooltipDataAttrs={tooltipDataAttrs}
        isHeatMapLevel={isHeatMapLevel}
        showOutOfRangeDays={showOutOfRangeDays}
        findColorLevel={findColorLevel}
        findColorLevelByPercent={findColorLevelByPercent}
        colorArray={colorArray}
        bgColor={bgColor}
        borderColor={borderColor}
      />
    )
  }

  const renderWeek = (weekIndex: number) => {
    const [x, y] = getTransformForWeek(weekIndex, horizontal, gutterSize, !!showMonthLabels)
    return (
      <G key={weekIndex} x={x} y={y}>
        {range(DAYS_IN_WEEK).map((dayIndex) =>
          renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex),
        )}
      </G>
    )
  }

  const renderAllWeeks = () => {
    return range(getWeekCount(numDays, endDate)).map((weekIndex) => renderWeek(weekIndex))
  }

  const renderMonthLabels = () => {
    if (!showMonthLabels) {
      return null
    }

    // don't render for last week, because label will be cut off
    const weekRange = range(getWeekCount(numDays, endDate) - 1)

    return weekRange.map((weekIndex) => {
      const endOfWeek = shiftDate(
        getStartDateWithEmptyDays(numDays, endDate),
        (weekIndex + 1) * DAYS_IN_WEEK,
      )
      const [x, y] = getMonthLabelCoordinates(weekIndex, horizontal, gutterSize)
      return endOfWeek.getDate() >= 1 && endOfWeek.getDate() <= DAYS_IN_WEEK ? (
        <Text key={weekIndex} x={x} y={y + 15} fill={labelColor}>
          {monthLabelForIndex
            ? monthLabelForIndex(endOfWeek.getMonth())
            : monthLabels[endOfWeek.getMonth()]}
        </Text>
      ) : null
    })
  }

  const getWeekdayLabelCoordinates = (dayIndex: number) => {
    if (horizontal) {
      return [
        0,
        (dayIndex + 1) * SQUARE_SIZE +
          dayIndex * gutterSize +
          SQUARE_SIZE +
          MONTH_LABEL_GUTTER_SIZE,
      ]
    }
    return [dayIndex * SQUARE_SIZE + dayIndex * gutterSize, SQUARE_SIZE]
  }

  const renderWeekdayLabels = () => {
    if (!showWeekdayLabels) {
      return null
    }
    return weekdaysShort.map((weekdayLabel, dayIndex) => {
      const [x, y] = getWeekdayLabelCoordinates(dayIndex)
      return (dayIndex + 1) % 2 === 0 ? (
        <Text key={`${x}${y}`} x={x} y={y - 4} fill={labelColor} textAnchor="end">
          {weekdayLabel}
        </Text>
      ) : null
    })
  }

  const width = getWidth(numDays, endDate, gutterSize)
  const height = getHeight(gutterSize, !!showMonthLabels, horizontal)

  return (
    <MyScrollView horizontal>
      <Svg width={width + 40} height={height} viewBox={`0 0 ${width} ${height}`}>
        <G translateX={15}>{renderMonthLabels()}</G>
        <G translateX={15}>{renderAllWeeks()}</G>
        <G translateX={5}>{renderWeekdayLabels()}</G>
      </Svg>
    </MyScrollView>
  )
}
