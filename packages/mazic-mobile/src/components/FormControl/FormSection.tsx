import React, { useState } from 'react'
import { View } from 'react-native'
import { List } from 'react-native-paper'

interface FormSectionProps {
  children: React.ReactNode
  title: React.ReactNode | string
  icon?: string
}

export const FormSection = ({ title, icon, children }: FormSectionProps) => {
  const [expanded, setExpanded] = useState(true)
  return (
    <List.Accordion
      title={title}
      left={(props) => icon && <List.Icon {...props} icon={icon} />}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={{ marginLeft: -16, marginRight: 24 }}>{children}</View>
    </List.Accordion>
  )
}
