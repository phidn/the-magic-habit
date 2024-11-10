import React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import color from 'color'

interface IProps {
  title: string
}

export const CardTitle = ({ title }: IProps) => {
  const { colors } = useTheme()
  const _onBackground = color(colors.onBackground).alpha(0.6).toString()

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: _onBackground }}>{title}</Text>
    </View>
  )
}
