import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'react-native-paper'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

import { screens } from '@/config/config'
import useHydration from '@/hooks/useHydration'
import useIsReady from '@/hooks/useIsReady'
import { HabitListScreen } from '@/modules/habit/HabitListScreen'
import { SettingsScreen } from '@/modules/settings'
import { useStoreShallow } from '@/store/useStore'
import { TNavigationRoot } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

import StatsTopTabs from './StatsTopTabs'

const BottomTab = createMaterialBottomTabNavigator()

const BottomTabNavigator = () => {
  const navigation = useNavigation<TNavigationRoot>()
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()

  const bottomTabRoutes = [
    {
      name: 'HabitList',
      title: t(languageKeys['Navigation.BottomTab.HabitList']),
      component: HabitListScreen,
      IconComponent: MaterialCommunityIcons,
      icon: 'heart',
    },
    {
      name: 'StatsTab',
      title: t(languageKeys['Navigation.BottomTab.StatsTab']),
      component: StatsTopTabs,
      IconComponent: MaterialCommunityIcons,
      icon: 'chart-box',
    },
    {
      name: 'SettingsTab',
      title: t(languageKeys['Navigation.BottomTab.SettingsTab']),
      component: SettingsScreen,
      IconComponent: MaterialCommunityIcons,
      icon: 'account',
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
      navigation.setOptions({ title: t(`Navigation.BottomTab.${bottomActiveTab}`) || '' })
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
      {bottomTabRoutes.map((bottomTabRoute, idx) => (
        <BottomTab.Screen
          key={`${bottomTabRoute.name || idx}`}
          name={bottomTabRoute.name}
          component={bottomTabRoute.component}
          options={{
            title: bottomTabRoute.title,
            tabBarLabel: bottomTabRoute.title,
            tabBarIcon: ({ focused, color }) => (
              <bottomTabRoute.IconComponent
                color={color}
                name={focused ? bottomTabRoute.icon : `${bottomTabRoute.icon}-outline`}
                size={26}
              />
            ),
            tabBarBadge: bottomTabRoute.name === bottomActiveTab,
          }}
        />
      ))}
    </BottomTab.Navigator>
  ) : null
}

export default BottomTabNavigator
