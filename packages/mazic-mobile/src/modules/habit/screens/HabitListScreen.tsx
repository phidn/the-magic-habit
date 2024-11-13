import React from 'react'

import PageContainer from '@/components/Containers/PageContainer'
import { themeSpacing } from '@/config/theme'

import { useListHabitApi } from '../apis'
import { HabitCard } from '../components/HabitCard'

export const HabitListScreen = () => {
  const { data } = useListHabitApi({ pageSize: -1, entry_expand: true })

  return (
    <PageContainer isScroll style={{ paddingVertical: themeSpacing.md }}>
      {(data || []).map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </PageContainer>
  )
}
