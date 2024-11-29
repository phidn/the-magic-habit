import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'react-native-paper'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

import { screens } from '@/config/config'
import useHydration from '@/hooks/useHydration'
import useIsReady from '@/hooks/useIsReady'
import { HabitListScreen } from '@/modules/habit'
import { SettingsScreen } from '@/modules/settings'
import { TimelineJournalScreen } from '@/modules/timeline-journal/TimelineJournalScreen'
import { useStoreShallow } from '@/store/useStore'
import { TNavigationRoot } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

type BottomTabRoute = {
  name: 'HabitList' | 'HabitCreate' | 'SettingsTab' | 'TimelineJournal'
  options?: Partial<NativeStackNavigationOptions>
  component: React.ComponentType<any>
  renderIcon: (props: { focused: boolean; color: string }) => React.ReactNode
}

const BottomTab = createMaterialBottomTabNavigator()

const BottomTabNavigator = () => {
  const navigation = useNavigation<TNavigationRoot>()
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()

  const bottomTabRoutes: BottomTabRoute[] = [
    {
      name: 'HabitList',
      options: {
        title: t(languageKeys['Navigation.BottomTab.HabitList']),
        headerTitleAlign: 'left',
        headerShown: false,
      },
      component: HabitListScreen,
      renderIcon: ({ focused, color }) => (
        <MaterialCommunityIcons
          color={color}
          name={focused ? 'heart' : 'heart-outline'}
          size={26}
        />
      ),
    },
    {
      name: 'TimelineJournal',
      options: {
        title: t(languageKeys['Navigation.BottomTab.TimelineJournal']),
        headerTitleAlign: 'left',
        headerShown: false,
      },
      component: TimelineJournalScreen,
      renderIcon: ({ focused, color }) => (
        <MaterialCommunityIcons
          color={color}
          name={focused ? 'timeline-text' : 'timeline-text-outline'}
          size={26}
        />
      ),
    },
    {
      name: 'SettingsTab',
      options: {
        title: t(languageKeys['Navigation.BottomTab.SettingsTab']),
        headerTitleAlign: 'left',
        headerShown: false,
      },
      component: SettingsScreen,
      renderIcon: ({ focused, color }) => (
        <MaterialCommunityIcons
          color={color}
          name={focused ? 'account' : 'account-outline'}
          size={26}
        />
      ),
    },
  ]

  const [bottomActiveTab, setBottomActiveTab, currentUser] = useStoreShallow((state) => [
    state.bottomActiveTab,
    state.setBottomActiveTab,
    state.currentUser,
  ])

  const hydrated = useHydration()
  const isReady = useIsReady(hydrated, bottomActiveTab)

  useEffect(() => {
    if (bottomActiveTab) {
      const currentTab = bottomTabRoutes.find((route) => route.name === bottomActiveTab)
      navigation.setOptions({
        title: currentTab?.options?.title,
        headerTitleAlign: currentTab?.options?.headerTitleAlign,
        headerRight: currentTab?.options?.headerRight,
        headerShown: currentTab?.options?.headerShown,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, bottomActiveTab])

  useEffect(() => {
    if (hydrated && currentUser.loaded && !currentUser?.user) {
      navigation.navigate(screens.LoginScreen)
    }
  }, [hydrated, currentUser, navigation])

  return isReady ? (
    <BottomTab.Navigator
      initialRouteName={bottomActiveTab}
      activeColor={colors.primary}
      labeled={false}
      screenListeners={() => ({
        state: (event) => {
          const { routeNames, index } = event.data.state
          setBottomActiveTab(routeNames[index])
        },
      })}
    >
      {bottomTabRoutes.map((tab, idx) => (
        <BottomTab.Screen
          key={`${tab.name || idx}`}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab?.options?.title,
            tabBarLabel: tab?.options?.title,
            tabBarIcon: ({ focused, color }) => tab.renderIcon({ focused, color }),
            tabBarBadge: tab.name === bottomActiveTab,
          }}
        />
      ))}
    </BottomTab.Navigator>
  ) : null
}

export default BottomTabNavigator
