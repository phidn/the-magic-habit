import React from 'react'
import { useTranslation } from 'react-i18next'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { screens } from '@/config/config'
import { LoginScreen, SignUpScreen } from '@/modules/auth'
import { HabitCreateScreen, HabitListScreen, HabitUpdateScreen } from '@/modules/habit'
import { MeditateScreen } from '@/modules/mindfulness-timer'
import { LanguageSettingScreen } from '@/modules/settings'
import { RootStackNavigator } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

import BottomNavigator from './BottomNavigator'

const Stack = createNativeStackNavigator<RootStackNavigator>()

interface IRoute {
  name: keyof RootStackNavigator
  component: React.ComponentType<any>
  options?: {
    headerTitle?: string
    headerTitleAlign?: 'center' | 'left' | undefined
    headerShown: boolean
  }
}

const MainNavigator = () => {
  const { t } = useTranslation()

  const appRoutes: IRoute[] = [
    {
      name: screens.BottomTabNavigator,
      component: BottomNavigator,
      options: {
        headerShown: false,
        headerTitleAlign: 'center',
      },
    },
    {
      name: screens.LanguageSettingScreen,
      component: LanguageSettingScreen,
      options: {
        headerTitle: t(languageKeys['Settings.language']),
        headerShown: true,
        headerTitleAlign: 'center',
      },
    },
    {
      name: screens.MeditateScreen,
      component: MeditateScreen,
      options: {
        headerTitle: t(languageKeys['Navigation.Screen.timer']),
        headerShown: false,
        headerTitleAlign: 'center',
      },
    },
    {
      name: screens.HabitUpdateScreen,
      component: HabitUpdateScreen,
      options: {
        headerTitle: t(languageKeys['Habit.edit.title']),
        headerShown: false,
        headerTitleAlign: 'center',
      },
    },
    {
      name: screens.HabitCreateScreen,
      component: HabitCreateScreen,
      options: {
        headerTitle: t(languageKeys['Habit.create.title']),
        headerShown: false,
        headerTitleAlign: 'center',
      },
    },
    {
      name: screens.HabitListScreen,
      component: HabitListScreen,
      options: {
        headerShown: false,
      },
    },
  ]

  const publicRoutes: IRoute[] = [
    {
      name: screens.SignUpScreen,
      component: SignUpScreen,
      options: {
        headerTitle: t(languageKeys['Navigation.Screen.timer']),
        headerShown: false,
        headerTitleAlign: 'center',
      },
    },
    {
      name: screens.LoginScreen,
      component: LoginScreen,
      options: {
        headerTitle: t(languageKeys['Navigation.Screen.timer']),
        headerShown: false,
        headerTitleAlign: 'center',
      },
    },
  ]

  return (
    <Stack.Navigator initialRouteName={screens.BottomNavigator}>
      {appRoutes.map((route: IRoute) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
      {publicRoutes.map((route: IRoute) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  )
}

export default MainNavigator
