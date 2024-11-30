import React, { useMemo } from 'react'
import dayjs from 'dayjs'

import { THabit } from '@mazic/shared'

import PageContainer from '@/components/Containers/PageContainer'

import { useListHabitApi } from '../habit/apis'

import ExpandableCalendarScreen from './ExpandableCalendarScreen'

export const TimelineJournalScreen = () => {
  const { data, isRefetching, isFetching } = useListHabitApi({
    pageSize: -1,
    entry_expand: true,
  })

  const agendaItems = useMemo(() => {
    type Item = {
      [key: string]: {
        habit: THabit
        journal: string
        day: string
      }[]
    }
    const _items: Item = {}

    data.forEach((habit) => {
      habit.check_in_items.forEach((item) => {
        const _date = dayjs(item.date)
        if (item.journal) {
          const _dateString = _date.format('YYYY-MM-DD')
          if (!_items[_dateString]) {
            _items[_dateString] = []
          }
          _items[_dateString].push({
            habit,
            journal: item.journal,
            day: _dateString,
          })
        }
      })
    })

    const result = []
    for (const key in _items) {
      result.push({
        title: key,
        data: (_items[key] || []).map((x) => {
          return {
            hour: '',
            duration: '1h',
            title: x?.journal,
            habitName: x?.habit?.title,
          }
        }),
      })
    }
    return result
  }, [data])

  return (
    <PageContainer appbar={{ title: 'Timeline Journal' }} isLoading={isFetching || isRefetching}>
      {agendaItems?.length && <ExpandableCalendarScreen items={agendaItems} />}
    </PageContainer>
  )
}
