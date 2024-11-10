import React from 'react'
import { ScrollView, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface IProps {
  style?: any
  children: React.ReactNode
}

const TopBannerAdContainer = ({ style, children }: IProps) => {
  const { colors } = useTheme()

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </ScrollView>
  )
}

export default TopBannerAdContainer
