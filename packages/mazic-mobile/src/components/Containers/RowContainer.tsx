import React from 'react'
import { StyleSheet, View } from 'react-native'

interface IProps {
  style?: any
  reverse?: boolean
  children: React.ReactNode
}

const RowContainer = ({ style, reverse, children, ...rest }: IProps) => {
  const direction = reverse ? 'row-reverse' : 'row'

  return (
    <View style={[styles.container, style, { flexDirection: direction }]} {...rest}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RowContainer
