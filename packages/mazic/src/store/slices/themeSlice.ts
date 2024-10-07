import { ImmerStateCreator } from '@mazic/types/index'

type TTheme = 'dark' | 'light' | 'system'
type TMode = 'dark' | 'light'

export interface IThemeSlice {
  theme: {
    theme: TTheme
    mode: TMode
  }
  setTheme: (theme: TTheme) => void
}

export const themeSlice: ImmerStateCreator<IThemeSlice> = (set) => ({
  theme: {
    theme: 'system',
    mode: 'light',
  },
  setTheme: (theme) =>
    set((state) => {
      state.theme.theme = theme
      state.theme.mode = theme === 'dark' ? 'dark' : 'light'
    }),
})
