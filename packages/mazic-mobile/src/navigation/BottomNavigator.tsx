import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomNavigation } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { screens } from '@/config/config'
import useHydration from '@/hooks/useHydration'
import { HabitListScreen } from '@/modules/habit'
import { SettingsScreen } from '@/modules/settings'
import { TimelineJournalScreen } from '@/modules/timeline-journal/TimelineJournalScreen'
import { useStoreShallow } from '@/store/useStore'
import { TNavigationRoot } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

const BottomNavigator = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<TNavigationRoot>()

  const [routeIndex, setRouteIndex] = useState(0)
  const [routes] = useState([
    {
      key: screens.HabitListScreen,
      title: t(languageKeys['Navigation.BottomTab.HabitList']),
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {
      key: screens.TimelineJournalScreen,
      title: t(languageKeys['Navigation.BottomTab.TimelineJournal']),
      focusedIcon: 'timeline-text',
      unfocusedIcon: 'timeline-text-outline',
    },
    {
      key: screens.SettingsScreen,
      title: t(languageKeys['Navigation.BottomTab.Settings']),
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ])

  const [bottomActiveTab, setBottomActiveTab, currentUser] = useStoreShallow((state) => [
    state.bottomActiveTab,
    state.setBottomActiveTab,
    state.currentUser,
  ])
  const hydrated = useHydration()

  useEffect(() => {
    if (hydrated && currentUser.loaded && !currentUser?.user) {
      navigation.navigate(screens.LoginScreen)
    }
  }, [hydrated, currentUser, navigation])

  useEffect(() => {
    if (bottomActiveTab) {
      const idx = routes.findIndex((route) => route.key === bottomActiveTab)
      if (idx !== -1) {
        setRouteIndex(idx)
      }
    }
  }, [bottomActiveTab, routes])

  const onIndexChange = (idx: number) => {
    setRouteIndex(idx)
    setBottomActiveTab(routes[idx].key)
  }

  const renderScene = BottomNavigation.SceneMap({
    HabitListScreen: HabitListScreen,
    TimelineJournalScreen: TimelineJournalScreen,
    SettingsScreen: SettingsScreen,
  })

  return (
    <BottomNavigation
      shifting
      navigationState={{ index: routeIndex, routes }}
      onIndexChange={onIndexChange}
      renderScene={renderScene}
    />
  )
}

export default BottomNavigator
