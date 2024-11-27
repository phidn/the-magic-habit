import AsyncStorage from '@react-native-async-storage/async-storage'
import merge from 'lodash/merge'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import { storageKeys } from '@/config/config'

import { ChartSlice, chartSlice } from './slices/chart'
import {
  MeditationSlice,
  meditationSlice,
  PrepareSlice,
  prepareSlice,
  SessionSlice,
  sessionSlice,
} from './slices/meditation'
import {
  NavigationSlice,
  navigationSlice,
  RehydrateStorageSlice,
  rehydrateStorageSlice,
  ThemeSlice,
  themeSlice,
} from './slices/system'
import { TUserSlice, userSlice } from './slices/user'

type StoreState = RehydrateStorageSlice &
  ThemeSlice &
  NavigationSlice &
  PrepareSlice &
  MeditationSlice &
  SessionSlice &
  ChartSlice &
  TUserSlice

export const useStore = create<StoreState>()(
  persist(
    immer((...args) => ({
      ...rehydrateStorageSlice(...args),
      ...navigationSlice(...args),
      ...themeSlice(...args),
      ...prepareSlice(...args),
      ...meditationSlice(...args),
      ...sessionSlice(...args),
      ...chartSlice(...args),
      ...userSlice(...args),
    })),
    {
      version: 1,
      name: storageKeys.appStorage,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state && state.setHasHydrated(true),
      merge: (persistedState, currentState) => {
        return merge({}, currentState, persistedState)
      },
      partialize: (state) => {
        return {
          isDarkMode: state.isDarkMode,
          themeColor: state.themeColor,
        }
      },
    },
  ),
)

export const useStoreShallow = <U>(selector: (state: StoreState) => U) => {
  return useStore(useShallow<StoreState, U>(selector))
}
