import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

export type TChartRange = 'WEEK' | 'MONTH' | 'YEAR'

export const getWeekDates = () => {
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

export const getRangeDates = (type: TChartRange) => {
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
