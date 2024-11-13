import React, { useState } from 'react'
import { Button, Card, IconButton, Menu } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import { HeatMap } from '@/components/HeatMap/HeatMap'
import { screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { TNavigationRoot } from '@/types/navigation'

import { THabit } from '../utils'

interface IProps {
  habit: THabit
}

export const HabitCard = ({ habit }: IProps) => {
  const navigation = useNavigation<TNavigationRoot>()

  const [menuVisible, setMenuVisible] = useState(false)

  const endDate = dayjs().endOf('month').add(2, 'week')
  const startDate = endDate.subtract(1, 'year').endOf('week')
  const numDays = endDate.diff(startDate, 'days')

  return (
    <Card key={habit.id} style={{ marginBottom: themeSpacing.md }}>
      <Card.Title
        titleVariant="headlineSmall"
        title={habit.title}
        right={(props) => {
          return (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton {...props} icon="dots-vertical" onPress={() => setMenuVisible(true)} />
              }
            >
              <Menu.Item
                leadingIcon="square-edit-outline"
                onPress={() => navigation.navigate(screens.HabitEditScreen)}
                title="Edit"
              />
              <Menu.Item leadingIcon="delete" onPress={() => {}} title="Delete" />
            </Menu>
          )
        }}
        style={{ minHeight: 50 }}
      />

      <Card.Content>
        <HeatMap
          showMonthLabels
          showWeekdayLabels
          isHeatMapLevel
          endDate={new Date(endDate.toString())}
          numDays={numDays}
          values={habit.activities}
        />
      </Card.Content>
      <Card.Actions style={{ padding: themeSpacing.md }}>
        <Button icon="sticker-check-outline" mode="contained-tonal">
          Check-in
        </Button>
      </Card.Actions>
    </Card>
  )
}
