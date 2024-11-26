import React, { useState } from 'react'
import { Button, Card, IconButton, Menu, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import { checkInType, colors, THabit } from '@mazic/shared'

import { HeatMap } from '@/components/HeatMap/HeatMap'
import { screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { TNavigationRoot } from '@/types/navigation'

interface IProps {
  habit: THabit
}

export const HabitCard = ({ habit }: IProps) => {
  const navigation = useNavigation<TNavigationRoot>()
  const { dark } = useTheme()

  const [menuVisible, setMenuVisible] = useState(false)

  const endDate = dayjs().endOf('month').add(2, 'week')
  const startDate = endDate.subtract(1, 'year').endOf('week')
  const numDays = endDate.diff(startDate, 'days')
  const isNumberCheckIn = habit?.check_in_type === checkInType.INPUT_NUMBER
  const bgColor = dark ? colors.slate[9].hex : colors.slate[1].hex

  const panelColors = isNumberCheckIn
    ? [
        bgColor,
        colors[habit.color][2].hex,
        colors[habit.color][3].hex,
        colors[habit.color][4].hex,
        colors[habit.color][5].hex,
      ]
    : [bgColor, colors[habit.color][3].hex]

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
                onPress={() => {
                  setMenuVisible(false)
                  navigation.navigate(screens.HabitUpdateScreen, { habit })
                }}
                title="Edit"
              />
              <Menu.Item
                leadingIcon="delete"
                onPress={() => {
                  setMenuVisible(false)
                }}
                title="Delete"
              />
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
          colorArray={panelColors}
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
