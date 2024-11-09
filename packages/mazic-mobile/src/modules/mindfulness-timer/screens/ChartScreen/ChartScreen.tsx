import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, View } from 'react-native'
import { SegmentedButtons, useTheme } from 'react-native-paper'
import { Text as TextPaper } from 'react-native-paper'
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import Color from 'color'
import * as scale from 'd3-scale'
import dayjs from 'dayjs'

import CenterContainer from '@/components/Containers/CenterContainer'
import TopBannerAdContainer from '@/components/Containers/TopBannerAdContainer'
import { COLOR_LEVELS } from '@/components/HeatMap/utils'
import { TChart } from '@/store/slices/chart'
import { useStore } from '@/store/useStore'
import {
  getMonthDates,
  getMonthDatesInThreeMonths,
  getMonthDatesInYear,
  getThreeMonthsDates,
  getWeekDates,
  getWeekDatesInMonth,
  getYearsDates,
  rangeDates,
  sortDates,
} from '@/utils/chart'
import { calcTotalTime } from '@/utils/meditationSession'
import { getDMYFirstChar } from '@/utils/time'

import 'dayjs/locale/vi'

// 7 days
const weekDates = getWeekDates()

// 1 month
const monthDates = getMonthDates()
const weekDatesInMonth = getWeekDatesInMonth()

// 3 months
const threeMonthsDates = getThreeMonthsDates()
const monthDatesInThreeMonths = getMonthDatesInThreeMonths()

// 1 year
const yearDates = getYearsDates()
const monthDatesInYear = getMonthDatesInYear()

export const ChartScreen = () => {
  const { colors } = useTheme()
  const { t, i18n } = useTranslation()

  const [dayString, monthString, yearString] = getDMYFirstChar(i18n.language)

  const chartType = useStore((state) => state.chartType)
  const setChartType = useStore((state) => state.setChartType)

  const [data, setData] = useState<number[]>([])

  const [dataAllChart, setDataAllChart] = useState<{
    '7d': number[]
    '1m': number[]
    '3m': number[]
    '1y': number[]
    all: number[]
  }>({
    '7d': [],
    '1m': [],
    '3m': [],
    '1y': [],
    all: [],
  })
  const [datesInAll, setDatesInAll] = useState<string[]>([])
  const [yearInAll, setYearInAll] = useState<string[]>([])

  const [chartDatesByType, setChartDatesByType] = useState<string[]>([])

  const sessions = useStore((state) => state.sessions)

  useEffect(() => {
    setDataAllChart({
      '7d': getChartData('7d'),
      '1m': getChartData('1m'),
      '3m': getChartData('3m'),
      '1y': getChartData('1y'),
      all: getChartData('all'),
    })

    // Get years in all session
    const sessionDates = Object.keys(sessions)
    const sortSessionDates = sortDates(sessionDates)
    const start = sortSessionDates[0]
    const end = sortSessionDates[sortSessionDates.length - 1]
    const years = rangeDates(start, end, 'year').map((date) => dayjs(date).format('YYYY-MM-DD'))
    setYearInAll(years)

    // Get dates in all session
    const _datesInAll = rangeDates(start, end, 'day').map((date) =>
      dayjs(date).format('YYYY-MM-DD'),
    )
    setDatesInAll(_datesInAll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions])

  useEffect(() => {
    const dates = getChartDates(chartType)
    setChartDatesByType(dates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartType])

  const getChartDates = (_chartType: string) => {
    let dates: string[] = []
    switch (_chartType) {
      case '7d':
        dates = weekDates
        break
      case '1m':
        dates = monthDates
        break
      case '3m':
        dates = threeMonthsDates
        break
      case '1y':
        dates = yearDates
        break
      case 'all': {
        const sessionDates = Object.keys(sessions)
        const sortSessionDates = sortDates(sessionDates)

        const start = sortSessionDates[0]
        const end = sortSessionDates[sortSessionDates.length - 1]
        dates = rangeDates(start, end, 'day').map((date) => dayjs(date).format('YYYY-MM-DD'))
      }
    }
    return dates
  }
  const getChartData = (_chartType: string) => {
    const dates = getChartDates(_chartType)

    if (dates.length) {
      const chartData = dates.map((date: string) => {
        const value = calcTotalTime(sessions[date]?.logs || [])
        return value
      })
      return chartData
    }
    return []
  }

  useEffect(() => {
    const _chartData = dataAllChart[chartType]
    if (_chartData.length) {
      setData(_chartData)
    }
  }, [dataAllChart, chartType])

  const formatLabelXAxis = (_value: any, index: number): string => {
    if (chartType === '7d') {
      return dayjs(weekDates[index]).format('DD')
    }
    if (chartType === '1m') {
      if (weekDatesInMonth.indexOf(monthDates[index]) !== -1) {
        return dayjs(monthDates[index]).format('DD')
      }
    }
    if (chartType === '3m') {
      if (monthDatesInThreeMonths.indexOf(threeMonthsDates[index]) !== -1) {
        return dayjs(threeMonthsDates[index]).format('MM')
      }
    }
    if (chartType === '1y') {
      if (monthDatesInYear.indexOf(yearDates[index]) !== -1) {
        return dayjs(yearDates[index]).format('MM')
      }
    }
    if (chartType === 'all') {
      if (yearInAll.indexOf(datesInAll[index]) !== -1) {
        return dayjs(datesInAll[index]).format('YYYY')
      }
    }
    return ''
  }

  const renderRangeDates = () => {
    let formatDate = 'MMMM DD, YYYY'
    if (i18n.resolvedLanguage === 'vi') {
      formatDate = 'DD MMMM, YYYY'
    }
    dayjs.locale(i18n.resolvedLanguage)

    const start = dayjs(chartDatesByType[0]).format(formatDate)
    const end = dayjs(chartDatesByType[chartDatesByType.length - 1]).format(formatDate)
    let result = `${start} - ${end}`

    if (i18n.resolvedLanguage === 'vi') {
      result = result.replace(/tháng/g, 'Tháng')
    }

    return result
  }

  const axesSvg = { fontSize: 10, fill: Color(colors.onSurface).alpha(0.5).toString() }
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 30

  return (
    <TopBannerAdContainer style={{ padding: 20, paddingTop: 30 }}>
      <SafeAreaView style={{ alignItems: 'center', marginBottom: 20 }}>
        <SegmentedButtons
          value={chartType}
          onValueChange={(value) => setChartType(value as TChart)}
          density="small"
          buttons={[
            {
              value: '7d',
              label: '7' + dayString,
            },
            {
              value: '1m',
              label: '1' + monthString,
            },
            {
              value: '3m',
              label: '3' + monthString,
            },
            {
              value: '1y',
              label: '1' + yearString,
            },
            {
              value: 'all',
              label: '∞',
            },
          ]}
        />
      </SafeAreaView>

      <CenterContainer>
        <TextPaper variant="titleLarge">{t('Statistics.Chart.daily-meditation')}</TextPaper>
      </CenterContainer>
      <CenterContainer style={{ marginBottom: 30 }}>
        <TextPaper>{renderRangeDates()}</TextPaper>
      </CenterContainer>

      <View style={{ height: 250, flexDirection: 'row' }}>
        <YAxis
          data={data}
          style={{ marginBottom: xAxisHeight }}
          contentInset={verticalContentInset}
          svg={axesSvg}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <BarChart
            style={{ flex: 1 }}
            data={data}
            svg={{ fill: COLOR_LEVELS[1] }}
            contentInset={verticalContentInset}
            // spacing={0.2}
            gridMin={0}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: colors.outlineVariant }} />
          </BarChart>
          <XAxis
            style={{ marginHorizontal: -10, height: xAxisHeight }}
            data={data}
            scale={scale.scaleBand}
            formatLabel={formatLabelXAxis}
            contentInset={{ left: 10, right: 10 }}
            svg={axesSvg}
          />
        </View>
      </View>
    </TopBannerAdContainer>
  )
}
