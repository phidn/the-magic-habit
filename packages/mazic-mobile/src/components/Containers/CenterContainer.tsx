import React from 'react'
import { View } from 'react-native'

interface IProps {
  style?: any
  children: React.ReactNode
}

const CenterContainer = ({ style, children }: IProps) => {
  return (
    <View style={{ justifyContent: 'center', ...style }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  )
}

export default CenterContainer
