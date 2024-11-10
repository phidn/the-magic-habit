import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'

import { AuthContainer } from '@/components/Containers/AuthContainer'
import { screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { TNavigationRoot } from '@/types/navigation'
import { languageKeys } from '@/utils/language'

import { SignUpForm } from './SignUpForm'


interface IProps {
  navigation: TNavigationRoot
}

export const SignUpScreen = ({ navigation }: IProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <AuthContainer>
      <SignUpForm />

      <View style={{ marginTop: themeSpacing.md }}>
        <Button mode="text" dark={theme.dark} onPress={() => navigation.navigate(screens.LoginScreen)}>
          {t(languageKeys['Auth.SignUp.navigation.login'])}
        </Button>
      </View>
    </AuthContainer>
  )
}
