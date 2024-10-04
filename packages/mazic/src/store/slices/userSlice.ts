import { TUser } from '@mazic/modules/rbac/user/schemas/userSchema'
import { ImmerStateCreator } from '@mazic/types/index'
import { TMenuItem } from '@mazic/types/menu'

export interface UserSlice {
  sidebar: {
    isOpen: boolean
    openItem: TMenuItem
    toggle: () => void
    setOpenItem: (openItem: TMenuItem) => void
  }
  currentUser: TUser | Partial<TUser>
  setCurrentUser: (user: TUser) => void
}

const userSlice: ImmerStateCreator<UserSlice> = (set) => ({
  sidebar: {
    isOpen: true,
    openItem: {
      label: '',
      href: '',
    },
    toggle: () => set((state: any) => void (state.sidebar.isOpen = !state.sidebar.isOpen)),
    setOpenItem: (openItem: TMenuItem) =>
      set((state: any) => void (state.sidebar.openItem = openItem)),
  },
  currentUser: {
    avatar: '',
  },
  setCurrentUser: (user: TUser) => set((state: any) => void (state.currentUser = user)),
})

export default userSlice
