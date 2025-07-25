import React from 'react'
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { Appbar, ProgressBar, useTheme } from 'react-native-paper'

type TAction = {
  icon: string
  onPress: () => void
}

interface IProps {
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  isScroll?: boolean
  isLoading?: boolean
  appBarTitle?: string
  renderAppbar?: () => React.ReactNode
  appbar?: {
    title: string
    actions?: TAction[] | TAction
  }
}

const PageContainer = (props: IProps) => {
  const { containerStyle, style, isScroll, isLoading, children, renderAppbar, appbar } = props
  const { colors } = useTheme()
  const _containerStyle = [{ flex: 1 }, containerStyle]

  const appActions = Array.isArray(appbar?.actions)
    ? appbar?.actions || []
    : appbar?.actions?.onPress
    ? [appbar?.actions]
    : []

  return (
    <>
      {renderAppbar?.()}
      {appbar?.title && (
        <Appbar.Header elevated>
          <Appbar.Content title={appbar?.title} titleStyle={{ fontWeight: 'bold' }} />
          {appActions.map((action) => (
            <Appbar.Action key={action.icon} icon={action.icon} onPress={action.onPress} />
          ))}
        </Appbar.Header>
      )}
      {isLoading && <ProgressBar indeterminate visible={isLoading} />}
      <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
        {!isScroll && <View style={_containerStyle}>{children}</View>}
        {isScroll && <ScrollView style={_containerStyle}>{children}</ScrollView>}
      </View>
    </>
  )
}

export default PageContainer
