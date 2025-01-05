import React, { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Text } from 'react-native-paper'
import { en, registerTranslation } from 'react-native-paper-dates'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Toaster } from 'sonner-native'

import { useCheckVersion } from '@/hooks/useCheckVersion'
import useHydration from '@/hooks/useHydration'
import AppNavigator from '@/navigation/AppNavigator'
import { useStoreShallow } from '@/store/useStore'
import { debugStorage, getAccessToken } from '@/utils/asyncStorage'
import http from '@/utils/http'
import { combineTheme } from '@/utils/theme'

export const AppLayout = () => {
  const { i18n } = useTranslation()

  const [setCurrentUser, currentUser] = useStoreShallow((state) => [
    state.setCurrentUser,
    state.currentUser,
  ])
  const hydrated = useHydration()
  useCheckVersion()

  const [isDarkMode, themeColor] = useStoreShallow((state) => [state.isDarkMode, state.themeColor])
  const theme = combineTheme(themeColor, isDarkMode)

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = await getAccessToken()
        if (token) {
          const { data } = await http.get('/auth/me')
          setCurrentUser(data.data)
        } else {
          throw new Error('No token')
        }
      } catch (error) {
        setCurrentUser(undefined)
      }
    }

    if (hydrated && !currentUser.user) {
      getCurrentUser()
    }
    if (__DEV__ && hydrated) {
      debugStorage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, hydrated])

  useEffect(() => {
    if (i18n.language === 'vi') {
      registerTranslation('vi', {
        save: 'Lưu',
        selectSingle: 'Chọn ngày',
        selectMultiple: 'Chọn nhiều ngày',
        selectRange: 'Chọn khoảng thời gian',
        notAccordingToDateFormat: (inputFormat) => `Định dạng ngày phải là ${inputFormat}`,
        mustBeHigherThan: (date) => `Phải sau ngày ${date}`,
        mustBeLowerThan: (date) => `Phải trước ngày ${date}`,
        mustBeBetween: (startDate, endDate) => `Phải nằm trong khoảng từ ${startDate} - ${endDate}`,
        dateIsDisabled: 'Ngày không được phép',
        previous: 'Trước',
        next: 'Tiếp theo',
        typeInDate: 'Nhập ngày',
        pickDateFromCalendar: 'Chọn ngày từ lịch',
        close: 'Đóng',
        minute: 'Phút',
        hour: 'Giờ',
      })
    }
    if (i18n.language === 'en') {
      registerTranslation('en', en)
    }
  }, [i18n.language])

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <PaperProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AppNavigator theme={theme} />
            <Toaster position="bottom-center" />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </Suspense>
  )
}
