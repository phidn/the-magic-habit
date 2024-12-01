import React, { useEffect } from 'react'
import { FlatList } from 'react-native'
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
      isLoading={isPending || isRefetching}
      appbar={{
        title: CONFIG.appName,
        actions: {
          icon: 'plus',
          onPress: () => navigation.navigate(screens.HabitCreateScreen),
        },
      }}
    >
      <FlatList
        data={data || []}
        keyExtractor={(habit) => habit.id.toString()}
        renderItem={({ item }) => <HabitCard habit={item} refetch={refetch} />}
      />
    </PageContainer>
  )
}
