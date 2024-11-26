import React, { useEffect } from 'react'
import { Appbar } from 'react-native-paper'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import PageContainer from '@/components/Containers/PageContainer'
import { CONFIG, screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
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
      style={{ marginVertical: themeSpacing.sm }}
      isLoading={isPending || isRefetching}
      renderAppbar={() => {
        return (
          <Appbar.Header elevated>
            <Appbar.Content title={CONFIG.appName} titleStyle={{ fontSize: 17 }} />
            <Appbar.Action
              icon="plus"
              onPress={() => navigation.navigate(screens.HabitCreateScreen)}
            />
          </Appbar.Header>
        )
      }}
    >
      {(data || []).map((habit) => (
        <HabitCard key={habit.id} habit={habit} refetch={refetch} />
      ))}
    </PageContainer>
  )
}
