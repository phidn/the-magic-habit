import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper'
import { MD3Colors, NavigationTheme } from 'react-native-paper/lib/typescript/types'
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import color from 'color'

import { themeSources } from '@/config/theme'

type Schemes = {
  light: { [key in string]: string }
  dark: { [key in string]: string }
}

export const createDynamicThemeColors = (sourceColor: string): Schemes => {
  const opacity = {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
  }

  const modes: ('light' | 'dark')[] = ['light', 'dark']
  const { schemes, palettes } = themeFromSourceColor(argbFromHex(color(sourceColor).hex()))
  const { light, dark } = modes.reduce(
    (prev, curr) => {
      const elevations = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14]
      const schemeModeJSON = schemes[curr].toJSON()
      const elevation = elevations.reduce(
        (a, v, index) =>
          Object.assign(Object.assign({}, a), {
            [`level${index}`]:
              index === 0
                ? v
                : color(schemeModeJSON.surface)
                    .mix(color(schemeModeJSON.primary), Number(v))
                    .rgb()
                    .string(),
          }),
        {},
      )
      const customColors = {
        surfaceDisabled: color(schemeModeJSON.onSurface).alpha(opacity.level2).rgb().string(),
        onSurfaceDisabled: color(schemeModeJSON.onSurface).alpha(opacity.level4).rgb().string(),
        backdrop: color(palettes.neutralVariant.tone(20)).alpha(0.4).rgb().string(),
      }
      const dynamicThemeColors = Object.assign(
        {},
        ...Object.entries(schemeModeJSON).map(([colorName, colorValue]) => ({
          [colorName]: color(colorValue).rgb().string(),
        })),
        Object.assign({ elevation }, customColors),
      )
      return Object.assign(Object.assign({}, prev), { [curr]: dynamicThemeColors })
    },
    { light: {}, dark: {} },
  )
  return { light, dark }
}

export type TCombinedTheme = MD3Theme &
  NavigationTheme & {
    colors: MD3Colors & NavigationTheme['colors'] & { card: string } & { [key: string]: any }
  }

export const combineTheme = (source: string, isDarkMode: boolean): TCombinedTheme => {
  let customTheme
  try {
    customTheme = createDynamicThemeColors(source)
  } catch (error) {
    console.log('→ combineTheme error:', error)
    customTheme = createDynamicThemeColors('purple')
  }
  const selectedSchema = {
    source,
    light: { colors: customTheme.light },
    dark: { colors: customTheme.dark },
  }

  const selectedSchemaColors: { [key: string]: string } =
    selectedSchema[isDarkMode ? 'dark' : 'light'].colors

  const md3Theme = isDarkMode ? MD3DarkTheme : MD3LightTheme

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  })

  const navTheme = isDarkMode ? DarkTheme : LightTheme

  const customCardColor = color(selectedSchemaColors.surface)
    .mix(color(selectedSchemaColors.primary), 0.08)
    .rgb()
    .string()

  const combinedTheme: TCombinedTheme = {
    ...md3Theme,
    ...navTheme,
    colors: {
      ...md3Theme.colors,
      ...navTheme.colors,
      ...selectedSchemaColors,
      card: customCardColor,
    },
  }

  return combinedTheme
}

export const getThemeColors = () => {
  return themeSources.map((source) => {
    const theme = createDynamicThemeColors(source)

    return {
      source,
      light: { colors: theme.light },
      dark: { colors: theme.dark },
    }
  })
}

export const rgbaToHex = (rgba: string): string => {
  const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]+)?\)/
  const result = regex.exec(rgba)

  if (!result) {
    throw new Error('Invalid RGBA input')
  }

  // eslint-disable-next-line radix
  const r = parseInt(result[1])
  // eslint-disable-next-line radix
  const g = parseInt(result[2])
  // eslint-disable-next-line radix
  const b = parseInt(result[3])
  const a = result[4] !== undefined ? parseFloat(result[4]) : 1

  const toHex = (value: number): string => {
    const hex = value.toString(16).padStart(2, '0')
    return hex.toUpperCase()
  }

  const alphaHex = toHex(Math.round(a * 255))

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? alphaHex : ''}`
}
