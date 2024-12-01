import React, { useCallback, useRef } from 'react'
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars'
import { useTheme } from 'react-native-paper'
import dayjs from 'dayjs'

import AgendaItem from './AgendaItem'
import { getMarkedDates } from './utils'

interface IProps {
  items: any
}

const nowDate = dayjs().format('YYYY-MM-DD')

const CalendarItems = ({ items }: IProps) => {
  const marked = useRef(getMarkedDates(items))
  const { colors } = useTheme()
  const _theme = {
    monthTextColor: colors.primary,
    indicatorColor: colors.primary,
    todayTextColor: colors.primary,
    todayDotColor: colors.primary,
    agendaTodayColor: colors.primary,
    dotColor: colors.primary,
    todayButtonTextColor: colors.primary,
    selectedDayBackgroundColor: colors.primary,
    arrowColor: colors.primary,
    dayTextColor: colors.onPrimaryContainer,
  }

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />
  }, [])

  return (
    <CalendarProvider showTodayButton={false} date={nowDate} theme={_theme}>
      <ExpandableCalendar theme={_theme} firstDay={1} markedDates={marked.current} />
      <AgendaList
        sections={items}
        renderItem={renderItem}
        sectionStyle={{ backgroundColor: colors.background }}
      />
    </CalendarProvider>
  )
}

export default CalendarItems
