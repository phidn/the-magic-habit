import React from 'react'
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

interface IProps {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  isScroll?: boolean
  children: React.ReactNode
}

const PageContainer = ({ containerStyle, style, isScroll, children }: IProps) => {
  const { colors } = useTheme()

  const _containerStyle = [{ flex: 1 }, containerStyle]

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      {!isScroll && <View style={_containerStyle}>{children}</View>}
      {isScroll && <ScrollView style={_containerStyle}>{children}</ScrollView>}
    </View>
  )
}

export default PageContainer
