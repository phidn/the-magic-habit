import { baseColorMap, ColorName } from '@mazic/shared'
import { useStore } from '@mazic/store/useStore'
import { hslToHex, lightenHexColor } from '@mazic/utils/utils'

export const useColorMode = (color: string | undefined) => {
  const mode = useStore((state) => state.theme.mode)
  const _color = baseColorMap.get(color as ColorName)

  const hslColor = _color ? `hsl(${_color?.activeColor?.[mode]})` : 'var(--primary)'
  const hexColor = _color ? hslToHex(_color?.activeColor?.[mode]) : 'var(--primary)'
  const lightHexColor = lightenHexColor(hexColor, 30)
  const darkHexColor = lightenHexColor(hexColor, 130)

  return {
    mode,
    colorMode: hslColor,
    hexColor,
    lightHexColor,
    darkHexColor,
    adjustColor: (number: number) => lightenHexColor(hexColor, number),
  }
}
