import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { DateData, MarkedDates } from 'react-native-calendars/src/types'
import { Button, List, Modal, Portal, Text, useTheme } from 'react-native-paper'
import Color from 'color'
import dayjs from 'dayjs'

import TopBannerAdContainer from '@/components/Containers/TopBannerAdContainer'
import { COLOR_LEVELS } from '@/components/HeatMap/utils'
import { useStore } from '@/store/useStore'
import { languageKeys } from '@/utils/language'
import { getMinText } from '@/utils/time'
import { isNumber, roundNumber } from '@/utils/utils'
import { getAlphaByPercent } from '@/utils/utils'

export const CalendarScreen = () => {
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()

  const [isShowSoundDialog, setIsShowSoundDialog] = useState(false)
  const [modalDatePressed, setModalDatePressed] = useState('')
  const [calendarKey, setCalendarKey] = useState(0)

  const sessions = useStore((state) => state.sessions)

  const markedDates = (() => {
    const result: MarkedDates = {}
    for (const [key, value] of Object.entries(sessions)) {
      const totalTime = value.logs.reduce((accumulator, currentValue) => {
        const time = +currentValue.split('|')[0]
        if (isNumber(time)) {
          accumulator += time
        }
        return accumulator
      }, 0)

      const dots = value.logs.map((sessionLog, index) => {
        const [duration, ,] = sessionLog.split('|')
        const dotLevel = +duration / 90
        const dotAlpha = getAlphaByPercent(dotLevel * 100)
        return {
          key: `${index}_${sessionLog}`,
          color: Color(colors.onSurface).alpha(dotAlpha).toString(),
        }
      })

      const level = totalTime / 90
      const percent = level < 1 ? level * 100 : 100

      const findColorLevel = (p: number) => {
        const colorArray = COLOR_LEVELS
        if (p > 0 && p <= 40) return colorArray[0]
        if (p > 40 && p < 60) return colorArray[1]
        if (p >= 60 && p < 80) return colorArray[2]
        if (p > 80) return colorArray[3]
      }

      result[key] = {
        selected: true,
        selectedColor: findColorLevel(+percent),
        selectedTextColor: colors.onPrimary,
        dots,
      }
    }
    const today = dayjs().format('YYYY-MM-DD')
    if (!result[today]) {
      result[today] = { dots: [{ color: colors.error }] }
    }
    return result
  })()

  useEffect(() => {
    if (i18n.resolvedLanguage) {
      LocaleConfig.locales[i18n.resolvedLanguage] = {
        monthNames: t('Time.monthNames').split('_'),
        monthNamesShort: t('Time.monthNamesShort').split('_'),
        dayNames: t('Time.dayNames').split('_'),
        dayNamesShort: t('Time.dayNamesShort').split('_'),
        amDesignator: 'AM',
        pmDesignator: 'PM',
      }

      LocaleConfig.defaultLocale = i18n.resolvedLanguage
      setCalendarKey(Math.random())
    }
  }, [i18n.resolvedLanguage, t])

  useEffect(() => {
    setCalendarKey(Math.random())
  }, [colors.primary])

  const onDayPress = ({ dateString }: DateData) => {
    if (sessions[dateString]) {
      setIsShowSoundDialog(true)
      setModalDatePressed(dateString)
    }
  }

  return (
    <TopBannerAdContainer style={{ padding: 20 }}>
      <Calendar
        key={calendarKey}
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType={'multi-dot'}
        theme={{
          backgroundColor: colors.surface,
          calendarBackground: colors.surface,
          selectedDotColor: colors.surface,

          textSectionTitleDisabledColor: colors.onSurfaceDisabled,
          textDisabledColor: colors.onSurfaceDisabled,
          disabledArrowColor: colors.onSurfaceDisabled,

          monthTextColor: colors.primary,
          indicatorColor: colors.primary,
          todayTextColor: colors.primary,

          selectedDayTextColor: colors.onSurfaceVariant,
          selectedDayBackgroundColor: 'transparent',

          arrowColor: colors.tertiary,

          dayTextColor: colors.onSurfaceVariant,
          textSectionTitleColor: colors.onSurface,
        }}
      />
      {/* Modal meditation logs */}
      <Portal>
        <Modal
          visible={isShowSoundDialog}
          onDismiss={() => setIsShowSoundDialog(!isShowSoundDialog)}
          contentContainerStyle={{
            backgroundColor: colors.elevation.level3,
            padding: 20,
            margin: 20,
          }}
        >
          <Text variant="headlineSmall">{t(languageKeys['Statistics.CalendarTracker.meditation-log'])}</Text>
          <ScrollView style={[styles.modalScrollView, { borderColor: colors.outlineVariant }]}>
            {sessions[modalDatePressed]?.logs.map((sessionLog, index) => {
              const [duration, started, ended] = sessionLog.split('|')
              const _duration = String(roundNumber(+duration)).padStart(4, ' ')

              return (
                <List.Item
                  key={`${index}_${sessionLog}`}
                  title={`${started} - ${ended}`}
                  left={(props) => <List.Icon {...props} icon="timer-outline" />}
                  right={() => (
                    <Text variant="titleMedium" style={{}}>
                      {_duration} {getMinText(+duration, i18n.language)}
                    </Text>
                  )}
                />
              )
            })}
          </ScrollView>
          <View style={styles.modalActions}>
            <Button onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}>Ok</Button>
          </View>
        </Modal>
      </Portal>
    </TopBannerAdContainer>
  )
}

const styles = StyleSheet.create({
  modalScrollView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 10,
    paddingVertical: 20,
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -10,
  },
})
