import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useStore } from '@/store/useStore'
import { summary } from '@/utils/dateStreaks'
import { calcTotalTime } from '@/utils/meditationSession'
import { isNumber, roundNumber } from '@/utils/utils'
dayjs.extend(duration)
dayjs.extend(relativeTime)

const useStatsSessions = () => {
  const sessions = useStore((state) => state.sessions)

  const getNumberOfSessions = () => {
    let result = 0
    const dates = Object.keys(sessions)
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      result += sessions[date].logs.length || 0
    }
    return result
  }

  const getAvgSessionDuration = () => {
    let totalTime = 0,
      totalSessions = 0

    const dates = Object.keys(sessions)
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      totalTime += calcTotalTime(sessions[date]?.logs || [])
      totalSessions += sessions[date].logs.length || 0
    }
    if (totalSessions === 0) {
      return 0
    }
    return roundNumber(totalTime / totalSessions)
  }

  const getLongShortSession = () => {
    let longSession = 0,
      shortSession = 999999999999999

    const dates = Object.keys(sessions)
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      if (sessions[date]?.logs?.length) {
        for (let j = 0; j < sessions[date].logs.length; j++) {
          const _duration = +sessions[date].logs[j].split('|')[0]
          if (isNumber(_duration)) {
            if (longSession < _duration) longSession = _duration
            if (_duration < shortSession) shortSession = _duration
          }
        }
      }
    }

    if (shortSession === 999999999999999) shortSession = 0
    return [longSession, shortSession]
  }

  const summaryStreak = () => {
    const dates = Object.keys(sessions).map((date) => new Date(date))
    return summary({ dates })
  }

  const numberOfSessions = getNumberOfSessions()
  const avgSessionDuration = getAvgSessionDuration()
  const [longestSession, shortestSession] = getLongShortSession()
  const { currentStreak, longestStreak } = summaryStreak()

  return {
    numberOfSessions,
    avgSessionDuration,
    longestSession,
    shortestSession,
    currentStreak,
    longestStreak,
  }
}

export default useStatsSessions
