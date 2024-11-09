import { ImmerStateCreator } from '@/types/types'

type TUser = any

export interface TUserSlice {
  currentUser: {
    user?: TUser
    loaded: boolean
  }
  setCurrentUser: (user: TUser | undefined) => void
}

export const userSlice: ImmerStateCreator<TUserSlice> = (set) => ({
  currentUser: {
    user: undefined,
    loaded: false,
  },
  setCurrentUser: (user) =>
    set((state) => {
      state.currentUser.user = user
      state.currentUser.loaded = true
    }),
})
