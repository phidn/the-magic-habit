import { baseColorMap, ColorName } from '@mazic/shared'
import { useStore } from '@mazic/store/useStore'

const hslToHex = (hsl: string) => {
  const [h, s, l] = hsl.match(/\d+/g)?.map(Number) || []
  return `#${((1 << 24) + (h << 16) + (s << 8) + l).toString(16).slice(1)}`
}

export function lightenHexColor(hex: string, percent = 30): string {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Parse r, g, b from hex
  const num = parseInt(hex, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff

  // Lighten each channel
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

  // Convert back to hex
  const toHex = (c: number) => c.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

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
  }
}
