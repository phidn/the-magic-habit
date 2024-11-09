import omit from 'lodash/omit'

function toDate(argument: any): Date {
  const argStr = Object.prototype.toString.call(argument)
  if (argument instanceof Date || (typeof argument === 'object' && argStr === '[object Date]')) {
    return new argument.constructor(argument.getTime())
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument)
  } else {
    return new Date(NaN)
  }
}

function startOfDay(dirtyDate: any): Date {
  const date = toDate(dirtyDate)
  date.setHours(0, 0, 0, 0)
  return date
}

const subDays = (date: Date, d: number): Date => {
  date.setDate(date.getDate() - d)
  return date
}

const addDays = (date: Date, d: number): Date => {
  date.setDate(date.getDate() + d)
  return date
}

const isValid = (date: any): boolean => {
  return !isNaN((date instanceof Date ? date : new Date(date)).getTime())
}

const differenceInDays = (dateA: Date, dateB: Date): number => {
  return Math.round((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24))
}

const relativeDates = (): { today: Date; yesterday: Date; tomorrow: Date } => ({
  today: startOfDay(new Date()),
  yesterday: startOfDay(subDays(new Date(), 1)),
  tomorrow: startOfDay(addDays(new Date(), 1)),
})

const filterInvalidDates = (dates: any[]): Date[] =>
  dates
    .filter((date) =>
      !isValid(new Date(date))
        ? (console.error(
            `The date '${date}' is not in a valid date format and date-streaks is ignoring it. Browsers do not consistently support this and this package's results may fail. Verify the array of dates you're passing to date-streaks are all valid date strings. http://momentjs.com/docs/#/parsing/string/`,
          ),
          false)
        : true,
    )
    .map((date) => new Date(date))

const sortDates = (dates: Date[]): Date[] => {
  return dates.sort((a, b) => startOfDay(b).getTime() - startOfDay(a).getTime()).reverse()
}

const getDatesParameter = (param: any = {}): any[] => {
  if (Array.isArray(param)) {
    return param
  } else {
    const { dates } = param
    return dates || []
  }
}

interface SummaryResult {
  currentStreak: number
  longestStreak: number
  streaks: number[]
  todayInStreak: boolean
  withinCurrentStreak: boolean
  isInFuture: boolean
  isToday: boolean
  isYesterday: boolean
}

export const summary = (
  datesParam: any = [],
): Omit<SummaryResult, 'isToday' | 'isYesterday' | 'isInFuture'> => {
  const dates = getDatesParameter(datesParam)
  const { today, yesterday } = relativeDates()
  const allDates = filterInvalidDates(dates)
  const sortedDates = sortDates(allDates)

  const result = sortedDates.reduce<SummaryResult>(
    (acc, date, index) => {
      const first = new Date(date)
      const second = sortedDates[index + 1] ? new Date(sortedDates[index + 1]) : first
      const diff = differenceInDays(second, first)
      const isToday = acc.isToday || differenceInDays(date, today) === 0
      const isYesterday = acc.isYesterday || differenceInDays(date, yesterday) === 0
      const isInFuture = acc.isInFuture || differenceInDays(today, date) < 0

      if (diff === 0) {
        if (isToday) {
          acc.todayInStreak = true
        }
      } else {
        diff === 1 ? ++acc.streaks[acc.streaks.length - 1] : acc.streaks.push(1)
      }

      return {
        ...acc,
        longestStreak: Math.max(...acc.streaks),
        withinCurrentStreak:
          acc.isToday || acc.isYesterday || acc.isInFuture || isToday || isYesterday || isInFuture,
        currentStreak:
          isToday || isYesterday || isInFuture ? acc.streaks[acc.streaks.length - 1] : 0,
        isInFuture,
        isYesterday,
        isToday,
      }
    },
    {
      currentStreak: 0,
      longestStreak: 0,
      streaks: [1],
      todayInStreak: false,
      withinCurrentStreak: false,
      isInFuture: false,
      isToday: false,
      isYesterday: false,
    },
  )

  return omit(result, ['isToday', 'isYesterday', 'isInFuture'])
}
