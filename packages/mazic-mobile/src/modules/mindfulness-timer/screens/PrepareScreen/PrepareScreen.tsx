import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Button, IconButton, List, Text, useTheme } from 'react-native-paper'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import Slider from '@react-native-community/slider'
import { useNavigation } from '@react-navigation/native'
import Color from 'color'
import dayjs from 'dayjs'
import dayjsDuration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import CenterContainer from '@/components/Containers/CenterContainer'
import RowContainer from '@/components/Containers/RowContainer'
import TopBannerAdContainer from '@/components/Containers/TopBannerAdContainer'
import { HeatMap } from '@/components/HeatMap/HeatMap'
import { COLOR_LEVELS } from '@/components/HeatMap/utils'
import ChooseSoundModal from '@/components/Modals/ChooseSoundModal'
import { screens } from '@/config/config'
import useSound from '@/hooks/useSound'
import useStatsSessions from '@/hooks/useStatsSessions'
import { useStore } from '@/store/useStore'
import { TNavigationRoot } from '@/types/navigation'
import { languageKeys } from '@/utils/language'
import { getDayText, getMinText } from '@/utils/time'
import { isNumber, roundNumber } from '@/utils/utils'
import { getAlphaByPercent } from '@/utils/utils'

import { initPicker } from './utils'

dayjs.extend(weekOfYear)
dayjs.extend(dayjsDuration)
dayjs.extend(relativeTime)

export const PrepareScreen = () => {
  const navigation = useNavigation<TNavigationRoot>()

  const { t, i18n } = useTranslation()
  const { colors } = useTheme()
  const { playShortBell, release } = useSound()

  const [isShowSoundDialog, setIsShowSoundDialog] = useState(false)
  const { duration, interval, bellId, bellVolume } = useStore((state) => state.prepare)
  const setPrepare = useStore((state) => state.setPrepare)
  const sessions = useStore((state) => state.sessions)

  const { avgSessionDuration, longestStreak } = useStatsSessions()

  const calendarHeatmapValues = (() => {
    const result = []
    for (const [key, value] of Object.entries(sessions)) {
      const totalTime = value.logs.reduce((accumulator, currentValue) => {
        const time = +currentValue.split('|')[0]
        if (isNumber(time)) {
          accumulator += time
        }
        return accumulator
      }, 0)

      const level = totalTime / 90
      const percent = level < 1 ? level * 100 : 100
      const alpha = getAlphaByPercent(level * 100)

      result.push({
        date: key,
        selectedColor: Color(colors.tertiary).alpha(alpha).toString(),
        count: level,
        percent,
      })
    }

    const today = dayjs().format('YYYY-MM-DD')
    if (!sessions[today]) {
      result.push({ date: today, count: -1 })
    }
    return result
  })()

  const setDuration = (d: number) => setPrepare({ duration: d })
  const setInterval = (i: number) => setPrepare({ interval: i })
  const setBellVolume = (v: number) => setPrepare({ bellVolume: v })

  const showTimePicker = (type: string) => {
    const onChange = (event: DateTimePickerEvent, value?: Date) => {
      if (event.type === 'dismissed' || !value) return

      if (type === 'duration') {
        setDuration((value.getTime() - initPicker.time) / 1000)
      } else {
        setInterval((value.getTime() - initPicker.time) / 1000)
      }
    }

    const initTime = type === 'duration' ? initPicker.duration : initPicker.interval
    const value = new Date(initTime)
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: 'time',
      display: 'spinner',
      is24Hour: true,
      minuteInterval: __DEV__ ? 1 : 5,
      positiveButton: { textColor: colors.primary },
      neutralButton: { textColor: colors.primary },
      negativeButton: { textColor: colors.primary },
    })
  }

  const onBellVolumeChangeComplete = (value: number) => {
    setBellVolume(value)
    playShortBell(bellId, value)
  }

  const startSession = () => {
    release()

    let countInterval = 0
    let total = interval
    for (;;) {
      if (total < duration) {
        ++countInterval
        total += interval
      } else {
        break
      }
    }

    navigation.navigate(screens.MeditateScreen, {
      duration,
      interval,
      countInterval,
      bellId,
      bellVolume,
    })
  }

  const endWeek = dayjs().endOf('month').week() + 1
  const endWeekday = dayjs().week(endWeek).day(6).toDate()

  const { width } = useWindowDimensions()
  const numDays = roundNumber((width - 40 - 100) / 15) * 7

  return (
    <TopBannerAdContainer style={{ margin: 20, marginLeft: 30 }}>
      <List.Item
        title={<Text variant="titleMedium">{t(languageKeys['Prepare.duration'])}</Text>}
        right={() => (
          <RowContainer>
            <Text variant="titleMedium" style={[{ color: colors.primary }]}>
              {String(`${duration / 60} `).padStart(4, ' ')}
              {getMinText(duration / 60, i18n.resolvedLanguage || '')}
            </Text>
            <Feather
              color={colors.primary}
              name="chevron-right"
              size={24}
              style={styles.rightIcon}
            />
          </RowContainer>
        )}
        onPress={() => showTimePicker('duration')}
      />
      <List.Item
        title={<Text variant="titleMedium">{t(languageKeys['Prepare.invite-bell'])}</Text>}
        right={() => (
          <RowContainer>
            <Text variant="titleMedium" style={[{ color: colors.primary }]}>
              {String(`${interval / 60} `).padStart(4, ' ')}
              {getMinText(interval / 60, i18n.resolvedLanguage || '')}
            </Text>
            <Feather
              color={colors.primary}
              name="chevron-right"
              size={24}
              style={styles.rightIcon}
            />
          </RowContainer>
        )}
        onPress={() => showTimePicker('interval')}
      />
      <List.Item
        title={<Text variant="titleMedium">{t(languageKeys['Prepare.sound'])}</Text>}
        right={() => (
          <RowContainer>
            <Text variant="titleMedium" style={[{ color: colors.primary }]}>
              {bellId.replace(/_/g, ' ')}
            </Text>
            <Feather
              color={colors.primary}
              name="chevron-right"
              size={24}
              style={styles.rightIcon}
            />
          </RowContainer>
        )}
        onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}
      />

      <RowContainer style={{ paddingRight: 15 }}>
        <IconButton
          icon="volume-minus"
          iconColor={colors.onBackground}
          size={20}
          onPress={() => onBellVolumeChangeComplete(bellVolume - 0.1)}
        />
        <Slider
          style={{ flex: 1 }}
          value={bellVolume}
          onSlidingComplete={onBellVolumeChangeComplete}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.onBackground}
        />
        <IconButton
          icon="volume-plus"
          iconColor={colors.primary}
          size={20}
          onPress={() => onBellVolumeChangeComplete(bellVolume + 0.1)}
        />
      </RowContainer>

      <Button icon="heart-flash" mode="elevated" style={styles.buttonPlay} onPress={startSession}>
        {t(languageKeys['Prepare.start'])}
      </Button>

      {/* Heatmap */}
      <View style={styles.heatmapContainer}>
        <HeatMap endDate={endWeekday} numDays={numDays} values={calendarHeatmapValues} />
      </View>
      <CenterContainer>
        <View style={{ marginTop: 20, alignItems: 'baseline' }}>
          <RowContainer style={{ marginRight: 15 }}>
            <FontAwesome5 name={'seedling'} style={{ marginRight: 5, color: COLOR_LEVELS[1] }} />
            <Text variant="labelSmall">{t(languageKeys['StatsTopTabs.session.avgDuration'])}</Text>
            <Text variant="labelSmall">
              {`: ${avgSessionDuration} `}
              {getMinText(avgSessionDuration, i18n.resolvedLanguage || '')}
            </Text>
          </RowContainer>
          <RowContainer>
            <FontAwesome5 name={'seedling'} style={{ marginRight: 5, color: COLOR_LEVELS[2] }} />
            <Text variant="labelSmall">{t('StatsTopTabs.session.longestStreak')}</Text>
            <Text variant="labelSmall">
              {`: ${longestStreak} `}
              {getDayText(longestStreak, i18n.resolvedLanguage || '')}
            </Text>
          </RowContainer>
        </View>
      </CenterContainer>

      {/* Modal choose bell sound */}
      <ChooseSoundModal
        isShow={isShowSoundDialog}
        toggleShow={() => setIsShowSoundDialog(!isShowSoundDialog)}
        initValue={bellId}
        soundVolume={bellVolume}
      />
    </TopBannerAdContainer>
  )
}

const styles = StyleSheet.create({
  rightIcon: {
    marginLeft: 10,
  },
  buttonPlay: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 30,
  },
  heatmapContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -25,
  },
})
