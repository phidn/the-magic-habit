import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { List } from 'react-native-paper'

export const HabitEditScreen = () => {
  const [expanded, setExpanded] = React.useState(true)
  const handlePress = () => setExpanded(!expanded)

  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <List.Section>
        <List.Accordion title="Detail" left={(props) => <List.Icon {...props} icon="folder" />}>
          <List.Item title="" />
          <List.Item title="Second item" />
        </List.Accordion>

        <List.Accordion
          title="Controlled Accordion"
          left={(props) => <List.Icon {...props} icon="folder" />}
          expanded={expanded}
          onPress={handlePress}
        >
          <List.Item title="First item" />
          <List.Item title="Second item" />
        </List.Accordion>
      </List.Section>
    </FormProvider>
  )
}
