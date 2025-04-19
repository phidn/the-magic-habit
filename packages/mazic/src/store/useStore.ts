import merge from 'lodash/merge'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import { loadingSlice, TLoadingSlice } from './slices/loadingSlice'
import { modalSlice, TModalSlice } from './slices/modalSlice'
import { rehydrateSlice, TRehydrateSlice } from './slices/rehydrateSlice'
import { IThemeSlice, themeSlice } from './slices/themeSlice'
import { TUserSlice, userSlice } from './slices/userSlice'

type Store = TRehydrateSlice & TUserSlice & TLoadingSlice & TModalSlice & IThemeSlice

export const useStore = create<Store>()(
  persist(
    immer((...arg) => ({
      ...rehydrateSlice(...arg),
      ...loadingSlice(...arg),
      ...modalSlice(...arg),
      ...userSlice(...arg),
      ...themeSlice(...arg),
    })),
    {
      version: 1,
      name: 'app_storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state && state.setHasHydrated(true),
      merge: (persistedState, currentState) => {
        return merge({}, currentState, persistedState)
      },
      partialize: (state) => {
        return {
          sidebar: {
            isOpen: state.sidebar.isOpen,
          },
          chartType: state.chartType,
          chartRange: state.chartRange,
        }
      },
    }
  )
)

export const useStoreShallow = <U>(selector: (state: Store) => U) => {
  return useStore(useShallow<Store, U>(selector))
}
