import React, { useRef, useState } from 'react'
import { Button, Card, IconButton, Menu, useTheme } from 'react-native-paper'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import { colors, THabit } from '@mazic/shared'

import { HeatMap } from '@/components/HeatMap/HeatMap'
import { screens } from '@/config/config'
import { themeSpacing } from '@/config/theme'
import { TNavigationRoot } from '@/types/navigation'

import { CheckInModal } from './CheckInModal'

interface IProps {
  habit: THabit
  refetch?: () => void
}

export const HabitCard = ({ habit, refetch }: IProps) => {
  const navigation = useNavigation<TNavigationRoot>()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const { dark } = useTheme()

  const [menuVisible, setMenuVisible] = useState(false)

  const endDate = dayjs().endOf('week').add(2, 'week')
  const startDate = endDate.subtract(1, 'year').endOf('week')
  const numDays = endDate.diff(startDate, 'days')

  const panelColors = [
    colors[habit.color][1].hex,
    colors[habit.color][2].hex,
    colors[habit.color][3].hex,
    colors[habit.color][4].hex,
    colors[habit.color][5].hex,
  ]
  const activityMap = new Map(habit.activities.map((activity) => [activity.date, activity]))
  const activityDate = dayjs()
  const checkInData = activityMap.get(activityDate.format('YYYY-MM-DD'))
  const isDone = checkInData?.is_done || Number(checkInData?.count) > 0

  return (
    <>
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
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    onPress={() => setMenuVisible(true)}
                  />
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
          <Button
            key={`button_${dark}`}
            icon={isDone ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            mode={isDone ? 'outlined' : 'contained-tonal'}
            onPress={() => bottomSheetRef.current?.present()}
          >
            {isDone ? 'Done' : 'Check-in'}
          </Button>
        </Card.Actions>
      </Card>
      <CheckInModal
        ref={bottomSheetRef}
        habit={habit}
        checkInData={checkInData}
        activityDate={activityDate}
        refetch={refetch}
      />
    </>
  )
}
