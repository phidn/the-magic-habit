import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'

import { AuthContainer } from '@/components/Containers/AuthContainer'
import { screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { TNavigationRoot } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

import { LoginForm } from './LoginForm'

interface IProps {
  navigation: TNavigationRoot
}

export const LoginScreen = ({ navigation }: IProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <AuthContainer>
      <LoginForm />
      <View style={{ marginTop: themeSpacing.md }}>
        <Button
          style={{}}
          mode="text"
          dark={theme.dark}
          onPress={() => navigation.navigate(screens.ForgotPassword)}
        >
          {t(languageKeys['Auth.Login.navigation.forgotPassword'])}
        </Button>
        <Button mode="text" dark={theme.dark} onPress={() => navigation.navigate(screens.SignUpScreen)}>
          {t(languageKeys['Auth.Login.navigation.signUp'])}
        </Button>
      </View>
    </AuthContainer>
  )
}
