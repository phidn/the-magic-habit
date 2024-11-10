import React from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import LoginSvg from '@/assets/svgs/login.svg'
import { themeSpacing } from '@/config/theme'

import PageContainer from './PageContainer'

interface IProps {
  children: React.ReactNode
  title?: string
}

export const AuthContainer = ({ children, title }: IProps) => {
  const { colors } = useTheme()

  return (
    <SafeAreaView style={{ flex: 1, padding: themeSpacing.md }}>
      <PageContainer isScroll style={{ alignItems: 'center', flexDirection: 'row' }}>
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LoginSvg width={150} height={150} fill={colors.elevation.level3} />
          </View>
          {title && (
            <View style={{ alignItems: 'center' }}>
              <Text variant="headlineMedium">{title}</Text>
            </View>
          )}
          {children}
        </KeyboardAvoidingView>
      </PageContainer>
    </SafeAreaView>
  )
}
