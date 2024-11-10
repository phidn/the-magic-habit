import dayjs from 'dayjs'
import dayjsDuration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'

import 'dayjs/locale/vi'
import 'dayjs/locale/en'

dayjs.extend(dayjsDuration)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const getTime = (duration: number, format: string): string => {
  return dayjs.duration(duration, 'seconds').format(format)
}

export const getCountdown = (duration: number): string => {
  const HOUR = 3600
  return dayjs
    .duration(duration, 'seconds')
    .format(duration > HOUR ? 'HH:mm:ss' : 'mm:ss')
    .trim()
}

export const sToMs = (seconds: number): number => seconds * 1000
export const sToMin = (seconds: number): number => seconds / 60

export const getMinText = (minNumber: number, lang: string): string | undefined => {
  const minText = dayjs.duration(1, 'minute').locale(lang).humanize().split(' ').pop()
  const minsText = dayjs.duration(2, 'minute').locale(lang).humanize().split(' ').pop()

  if (minNumber <= 1) return minText
  if (minNumber > 1) return minsText
}

export const getDayText = (dayNumber: number, lang: string): string | undefined => {
  const dayText = dayjs.duration(1, 'day').locale(lang).humanize().split(' ').pop()
  const daysText = dayjs.duration(2, 'day').locale(lang).humanize().split(' ').pop()

  if (dayNumber <= 1) return dayText
  if (dayNumber > 1) return daysText
}

export const getDMYFirstChar = (lang: string): string[] => {
  const dayText = dayjs.duration(1, 'day').locale(lang).humanize().split(' ').pop()
  const monthText = dayjs.duration(1, 'month').locale(lang).humanize().split(' ').pop()
  const yearText = dayjs.duration(1, 'year').locale(lang).humanize().split(' ').pop()

  return [dayText, monthText, yearText].map((x) => (x ?? '').charAt(0).toUpperCase())
}
