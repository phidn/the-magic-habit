import React from 'react'
import { useTranslation } from 'react-i18next'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { screens } from '@/config/config'
import { LoginScreen, SignUpScreen } from '@/modules/auth'
import { MeditateScreen } from '@/modules/mindfulness-timer'
import { LanguageSettingScreen } from '@/modules/settings'
import { RootStackNavigator } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

import BottomTabNavigator from './BottomTabNavigator'

const Stack = createNativeStackNavigator<RootStackNavigator>()

interface IRoute {
  name: keyof RootStackNavigator
  component: React.ComponentType<any>
  options: {
    headerTitle?: string
    headerShown: boolean
    headerTitleAlign: 'center' | 'left' | undefined
  }
}

const MainNavigator = () => {
  const { t } = useTranslation()

  const appRoutes: IRoute[] = [
    {
      name: screens.BottomTabNavigator,
      component: BottomTabNavigator,
      options: {
        headerShown: true,
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
    <Stack.Navigator initialRouteName={screens.BottomTabNavigator}>
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
