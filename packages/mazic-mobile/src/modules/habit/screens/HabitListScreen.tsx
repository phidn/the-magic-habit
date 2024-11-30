import React, { useEffect } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import PageContainer from '@/components/Containers/PageContainer'
import { CONFIG, screens } from '@/config/config'
import { TNavigationRoot } from '@/types/navigation'

import { useListHabitApi } from '../apis'
import { HabitCard } from '../components/HabitCard'

export const HabitListScreen = () => {
  const isFocused = useIsFocused()
  const navigation = useNavigation<TNavigationRoot>()

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
      isLoading={isPending || isRefetching}
      appbar={{
        title: CONFIG.appName,
        actions: {
          icon: 'plus',
          onPress: () => navigation.navigate(screens.HabitCreateScreen),
        },
      }}
    >
      {(data || []).map((habit) => (
        <HabitCard key={habit.id} habit={habit} refetch={refetch} />
      ))}
    </PageContainer>
  )
}
