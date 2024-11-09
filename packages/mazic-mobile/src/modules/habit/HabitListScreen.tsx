import React from 'react'
import { Card } from 'react-native-paper'
import dayjs from 'dayjs'

import PageContainer from '@/components/Containers/PageContainer'
import { HeatMap } from '@/components/HeatMap/HeatMap'
import { themeSpacing } from '@/config/theme'

import { useListHabitApi } from './apis'

export const HabitListScreen = () => {
  const { data } = useListHabitApi({ pageSize: -1, entry_expand: true })

  const endDate = dayjs().endOf('month').add(2, 'week')
  const startDate = endDate.subtract(1, 'year').endOf('week')
  const numDays = endDate.diff(startDate, 'days')

  return (
    <PageContainer isScroll style={{ paddingVertical: themeSpacing.md }}>
      {(data || []).map((habit) => {
        return (
          <Card key={habit.id} style={{ marginBottom: themeSpacing.md }}>
            <Card.Title title={habit.title} />
            <Card.Content>
              <HeatMap
                showMonthLabels
                showWeekdayLabels
                isHeatMapLevel
                endDate={new Date(endDate.toString())}
                numDays={numDays}
                values={habit.activities}
              />
            </Card.Content>
          </Card>
        )
      })}
    </PageContainer>
  )
}
