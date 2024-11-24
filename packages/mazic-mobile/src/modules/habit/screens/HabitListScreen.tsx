import React, { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'

import PageContainer from '@/components/Containers/PageContainer'
import { themeSpacing } from '@/config/theme'

import { useListHabitApi } from '../apis'
import { HabitCard } from '../components/HabitCard'

export const HabitListScreen = () => {
  const isFocused = useIsFocused()

  const { data, refetch, isPending, isRefetching } = useListHabitApi({
    pageSize: -1,
    entry_expand: true,
  })
  useEffect(() => {
    if (isFocused) {
      refetch()
    }
  }, [isFocused, refetch])

  return (
    <PageContainer
      isScroll
      style={{ paddingVertical: themeSpacing.md }}
      isLoading={isPending || isRefetching}
    >
      {(data || []).map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </PageContainer>
  )
}
