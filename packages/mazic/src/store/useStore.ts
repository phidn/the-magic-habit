import merge from 'lodash/merge'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import { CONFIG } from '@mazic/config/config'

import rehydrateSlice, { RehydrateSlice } from './slices/rehydrateSlice'
import { systemSlice, TSystemSlice } from './slices/systemSlice'
import sidebarSlice, { UserSlice } from './slices/userSlice'

type Store = RehydrateSlice & UserSlice & TSystemSlice

export const useStore = create<Store>()(
  persist(
    immer((...arg) => ({
      ...rehydrateSlice(...arg),
      ...systemSlice(...arg),
      ...sidebarSlice(...arg),
    })),
    {
      version: 1,
      name: CONFIG.appStorage.key,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state && state.setHasHydrated(true),
      merge: (persistedState, currentState) => {
        return merge({}, currentState, persistedState)
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => CONFIG.appStorage.persistKeys.includes(key))
        ),
    }
  )
)

export const useStoreShallow = <U>(selector: (state: Store) => U) => {
  return useStore(useShallow<Store, U>(selector))
}
