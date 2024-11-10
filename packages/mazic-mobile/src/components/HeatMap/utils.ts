export const SQUARE_SIZE = 15
export const MONTH_LABEL_GUTTER_SIZE = 8
export const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000
export const DAYS_IN_WEEK = 7

export const COLOR_LEVELS = ['#9BE9A8', '#40C463', '#30A14E', '#216E39']

type Value = {
  date: string | Date
  count: number | null
  tooltipDataAttrs?: any
  title?: string
  percent?: number
  level?: number
}

type ValueCache = Record<number, { value: Value; tooltipDataAttrs?: any; title?: string }>

const getValueCache = (values: Value[], numDays: number, endDate: string | Date): ValueCache => {
  return values.reduce<ValueCache>((memo, value) => {
    const date = convertToDate(value.date)
    const heatmapIndex = Math.floor(
      (date.getTime() - getStartDateWithEmptyDays(numDays, endDate).getTime()) /
        MILLISECONDS_IN_ONE_DAY,
    )
    memo[heatmapIndex] = {
      value: value,
    }

    return memo
  }, {})
}

// returns a new date shifted a certain number of days (can be negative)
function shiftDate(date: string | Date, numDays: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}

function getBeginningTimeForDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// obj can be a parseable string, a millisecond timestamp, or a Date object
function convertToDate(obj: string | number | Date): Date {
  return obj instanceof Date ? obj : new Date(obj)
}

function getWeekWidth(gutterSize: number): number {
  return DAYS_IN_WEEK * getSquareSizeWithGutter(gutterSize)
}

function getWidth(numDays: number, endDate: string | Date, gutterSize: number): number {
  return getWeekCount(numDays, endDate) * getSquareSizeWithGutter(gutterSize) - gutterSize
}

function getHeight(gutterSize: number, showMonthLabels: boolean, horizontal: boolean): number {
  return getWeekWidth(gutterSize) + getMonthLabelSize(showMonthLabels, horizontal) - gutterSize
}

function getTooltipDataAttrsForValue(value: Value, tooltipDataAttrs: any): any {
  if (typeof tooltipDataAttrs === 'function') return tooltipDataAttrs(value)
  return tooltipDataAttrs
}

function getTooltipDataAttrsForIndex(
  index: number,
  valueCache: ValueCache,
  tooltipDataAttrs: any,
): any {
  if (valueCache[index]) {
    return valueCache[index].tooltipDataAttrs
  }
  return getTooltipDataAttrsForValue({ date: new Date(), count: null }, tooltipDataAttrs)
}

function getTitleForIndex(
  index: number,
  valueCache: ValueCache,
  titleForValue?: (value: Value | null) => string | null,
): string | null {
  if (valueCache[index]) return valueCache[index].title || null
  return titleForValue ? titleForValue(null) : null
}

function getSquareCoordinates(
  dayIndex: number,
  horizontal: boolean,
  gutterSize: number,
): [number, number] {
  if (horizontal) return [0, dayIndex * getSquareSizeWithGutter(gutterSize)]
  return [dayIndex * getSquareSizeWithGutter(gutterSize), 0]
}

function getTransformForWeek(
  weekIndex: number,
  horizontal: boolean,
  gutterSize: number,
  showMonthLabels: boolean,
): [number, number] {
  if (horizontal) {
    return [
      weekIndex * getSquareSizeWithGutter(gutterSize),
      getMonthLabelSize(showMonthLabels, horizontal),
    ]
  }
  return [10, weekIndex * getSquareSizeWithGutter(gutterSize)]
}

function getMonthLabelSize(showMonthLabels: boolean, horizontal: boolean): number {
  if (!showMonthLabels) {
    return 0
  } else if (horizontal) {
    return SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE
  }
  return 2 * (SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE)
}

function getSquareSizeWithGutter(gutterSize: number): number {
  return SQUARE_SIZE + gutterSize
}

function getMonthLabelCoordinates(
  weekIndex: number,
  horizontal: boolean,
  gutterSize: number,
): [number, number] {
  if (horizontal) {
    return [weekIndex * getSquareSizeWithGutter(gutterSize), 0]
  }
  const verticalOffset = -2
  return [0, (weekIndex + 1) * getSquareSizeWithGutter(gutterSize) + verticalOffset]
}

function getStartDateWithEmptyDays(numDays: number, endDate: string | Date): Date {
  return shiftDate(getStartDate(numDays, endDate), -getNumEmptyDaysAtStart(numDays, endDate))
}

function getEndDate(endDate: string | Date): Date {
  return getBeginningTimeForDate(convertToDate(endDate))
}

function getStartDate(numDays: number, endDate: string | Date): Date {
  return shiftDate(getEndDate(endDate), -numDays + 1) // +1 because endDate is inclusive
}

function getNumEmptyDaysAtEnd(endDate: string | Date): number {
  return DAYS_IN_WEEK - 1 - getEndDate(endDate).getDay()
}

function getNumEmptyDaysAtStart(numDays: number, endDate: string | Date): number {
  return getStartDate(numDays, endDate).getDay()
}

function getWeekCount(numDays: number, endDate: string | Date): number {
  const numDaysRoundedToWeek =
    numDays + getNumEmptyDaysAtStart(numDays, endDate) + getNumEmptyDaysAtEnd(endDate)
  return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK)
}

export {
  shiftDate,
  getWeekCount,
  getStartDateWithEmptyDays,
  getMonthLabelCoordinates,
  getTransformForWeek,
  getNumEmptyDaysAtStart,
  getSquareCoordinates,
  getTitleForIndex,
  getTooltipDataAttrsForIndex,
  getHeight,
  getWidth,
  getValueCache,
}
