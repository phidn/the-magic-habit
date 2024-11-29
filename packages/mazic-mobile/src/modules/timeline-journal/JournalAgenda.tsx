import React, { useState } from 'react'
import { View } from 'react-native'
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars'
import { Card, List, useTheme } from 'react-native-paper'
import dayjs from 'dayjs'

import { THabit } from '@mazic/shared'

interface IProps {
  data: THabit[]
  isRefetching: boolean
  refetch: () => void
}

const nowDate = dayjs().format('YYYY-MM-DD')

const JournalAgenda = ({ data, refetch, isRefetching }: IProps) => {
  const [items, setItems] = useState<AgendaSchedule>({ [nowDate]: [] })
  const { colors } = useTheme()

  const loadItemsForMonth = (day: DateData) => {
    console.log('~ loadItemsForMonth day:', day)
    const _items: AgendaSchedule = {}
    const selectedDate = dayjs(day.dateString)
    data.forEach((habit) => {
      habit.check_in_items.forEach((item) => {
        const _date = dayjs(item.date)
        if (item.journal && _date.isSame(selectedDate, 'month')) {
          const _dateString = _date.format('YYYY-MM-DD')
          if (!_items[_dateString]) {
            _items[_dateString] = []
          }
          _items[_dateString].push({
            name: `${habit.title}||${item.journal}`,
            height: 50,
            day: _dateString,
          })
        }
      })
    })
    if (!_items[nowDate]?.length) {
      _items[nowDate] = []
    }
    if (!_items[selectedDate.format('YYYY-MM-DD')]?.length) {
      _items[selectedDate.format('YYYY-MM-DD')] = []
    }
    console.log('~ loadItemsForMonth _items:', _items)
    setItems(_items)
  }

  const renderItem = (reservation: AgendaEntry) => {
    const [habitTitle, journal] = reservation.name.split('||')
    return (
      <Card mode="contained" style={{ marginTop: 32, marginRight: 16, backgroundColor: 'white' }}>
        <Card.Title title={habitTitle} subtitle={journal} />
      </Card>
    )
  }

  const renderEmptyDate = () => (
    <View style={{ marginTop: 32 }}>
      <List.Item title="No journal entry" />
    </View>
  )

  return (
    /**
     * to customize the style of the calendar, you can use the theme prop
     * https://github.com/wix/react-native-calendars/blob/master/src/style.ts
     */
    <Agenda
      items={items}
      loadItemsForMonth={loadItemsForMonth}
      selected={nowDate}
      initialDate={nowDate}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      refreshing={isRefetching}
      onRefresh={refetch}
      theme={{
        monthTextColor: colors.primary,
        indicatorColor: colors.primary,
        todayTextColor: colors.primary,
        todayDotColor: colors.primary,
        agendaTodayColor: colors.primary,
        dotColor: colors.primary,
        todayButtonTextColor: colors.primary,
        selectedDayBackgroundColor: colors.primary,
        arrowColor: colors.primary,
      }}
    />
  )
}

export default JournalAgenda
