import React, { useEffect, useRef } from 'react'
import { useScrollIntoView } from 'react-native-scroll-into-view'
import { Rect } from 'react-native-svg'

import {
  getNumEmptyDaysAtStart,
  getSquareCoordinates,
  getTitleForIndex,
  getTooltipDataAttrsForIndex,
  SQUARE_SIZE,
} from './utils'

interface HeatMapSquareProps {
  numDays: number
  endDate: Date
  dayIndex: number
  index: number
  horizontal: boolean
  gutterSize: number
  valueCache: any
  titleForValue?: (value: any) => string
  tooltipDataAttrs?: (value: any) => any
  isHeatMapLevel: boolean
  showOutOfRangeDays: boolean
  findColorLevel: (level: number) => string
  findColorLevelByPercent: (percent: number) => string
  colorArray: string[]
  bgColor: string
  borderColor: string
}

/**
 * count = -1 to render today stroke
 */

export const HeatMapSquare = ({
  numDays,
  endDate,
  dayIndex,
  index,
  horizontal,
  gutterSize,
  valueCache,
  titleForValue,
  tooltipDataAttrs,
  isHeatMapLevel,
  showOutOfRangeDays,
  findColorLevel,
  findColorLevelByPercent,
  colorArray,
  bgColor,
  borderColor,
}: HeatMapSquareProps) => {
  const scrollIntoView = useScrollIntoView()
  const viewRef = useRef()

  const [x, y] = getSquareCoordinates(dayIndex, horizontal, gutterSize)
  const fillColor = isHeatMapLevel
    ? findColorLevel(valueCache[index]?.value?.level || 0)
    : findColorLevelByPercent(valueCache[index]?.value?.percent || 0)

  const isToday = valueCache[index]?.value?.count === -1
  const stroke = isToday ? colorArray[1] : fillColor !== bgColor ? borderColor : null

  useEffect(() => {
    if (isToday && viewRef.current) {
      scrollIntoView(viewRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToday])

  const indexOutOfRange =
    index < getNumEmptyDaysAtStart(numDays, endDate) ||
    index >= getNumEmptyDaysAtStart(numDays, endDate) + numDays

  if (indexOutOfRange && !showOutOfRangeDays) {
    return null
  }

  return (
    <Rect
      ref={isToday ? viewRef : undefined}
      key={index}
      width={SQUARE_SIZE}
      height={SQUARE_SIZE}
      x={x}
      y={y}
      title={getTitleForIndex(index, valueCache, titleForValue)}
      fill={fillColor}
      {...getTooltipDataAttrsForIndex(index, valueCache, tooltipDataAttrs)}
      stroke={stroke}
      rx={1}
      ry={1}
    />
  )
}
