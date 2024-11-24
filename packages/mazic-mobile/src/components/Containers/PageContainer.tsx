import React from 'react'
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'

interface IProps {
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  isScroll?: boolean
  isLoading?: boolean
}

const PageContainer = ({ containerStyle, style, isScroll, isLoading, children }: IProps) => {
  const { colors } = useTheme()

  const _containerStyle = [{ flex: 1 }, containerStyle]

  return (
    <>
      <ProgressBar indeterminate visible={isLoading} />
      <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
        {!isScroll && <View style={_containerStyle}>{children}</View>}
        {isScroll && <ScrollView style={_containerStyle}>{children}</ScrollView>}
      </View>
    </>
  )
}

export default PageContainer
