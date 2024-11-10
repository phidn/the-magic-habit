import React from 'react'
import { useTranslation } from 'react-i18next'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { CalendarScreen, ChartScreen, SessionStatsScreen } from '@/modules/mindfulness-timer'
import { useStore } from '@/store/useStore'
import { languageKeys } from '@/utils/language'

const TopTab = createMaterialTopTabNavigator()

enum statsTop {
  CalendarTab = 'CalendarTab',
  ChartTab = 'ChartTab',
  SessionTab = 'SessionTab',
}

function StatsTopTabs() {
  const { t } = useTranslation()
  const statsTopInitTab = useStore((state) => state.statsTopInitTab)
  const setStatsTopInitTab = useStore((state) => state.setStatsTopInitTab)

  return (
    <TopTab.Navigator
      initialRouteName={t(statsTopInitTab) || ''}
      screenListeners={() => ({
        state: (event) => {
          const { routeNames, index } = event.data.state
          setStatsTopInitTab(routeNames[index])
        },
      })}
    >
      <TopTab.Screen
        name={statsTop.CalendarTab}
        component={CalendarScreen}
        options={{ title: t(languageKeys['StatsTopTabs.CalendarTab']) || '' }}
      />
      <TopTab.Screen
        name={statsTop.ChartTab}
        component={ChartScreen}
        options={{ title: t(languageKeys['StatsTopTabs.ChartTab']) || '' }}
      />
      <TopTab.Screen
        name={statsTop.SessionTab}
        component={SessionStatsScreen}
        options={{ title: t(languageKeys['StatsTopTabs.SessionTab']) || '' }}
      />
    </TopTab.Navigator>
  )
}

export default StatsTopTabs
