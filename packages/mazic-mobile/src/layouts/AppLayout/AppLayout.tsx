import React, { Suspense, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Text } from 'react-native-paper'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Toaster } from 'sonner-native'

import useHydration from '@/hooks/useHydration'
import AppNavigator from '@/navigation/AppNavigator'
import { useStoreShallow } from '@/store/useStore'
import { debugStorage, getAccessToken } from '@/utils/asyncStorage'
import http from '@/utils/http'
import { combineTheme } from '@/utils/theme'

export const AppLayout = () => {
  const [setCurrentUser, currentUser] = useStoreShallow((state) => [
    state.setCurrentUser,
    state.currentUser,
  ])
  const hydrated = useHydration()

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
