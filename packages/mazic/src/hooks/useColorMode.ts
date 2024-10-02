import { baseColorMap, ColorName } from '@mazic/config/baseColors'
import { useTheme } from '@mazic/contexts/ThemeProvider'

export const useColorMode = (color: string) => {
  const { mode } = useTheme()
  const _color = baseColorMap.get(color as ColorName)

  return {
    mode,
    colorMode: _color ? `hsl(${_color?.activeColor?.[mode]})` : 'var(--primary)',
  }
}
