import React from 'react'
import { StatusBar } from 'react-native'
import BootSplash from 'react-native-bootsplash'
import { NavigationContainer } from '@react-navigation/native'
import color from 'color'

import { TCombinedTheme } from '@/utils/theme'

import MainNavigator from './MainNavigator'

interface IProps {
  theme: TCombinedTheme
}

const AppNavigator = ({ theme }: IProps) => {
  const onReadyNavigation = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    BootSplash.hide({ fade: true })
  }

  return (
    <NavigationContainer theme={theme} onReady={onReadyNavigation}>
      <StatusBar
        translucent={false}
        backgroundColor={
          !theme.dark
            ? color(theme.colors.card).hex()
            : color(theme.colors.card).hex()
        }
        barStyle={!theme.dark ? 'dark-content' : 'light-content'}
      />
      <MainNavigator />
    </NavigationContainer>
  )
}

export default AppNavigator
