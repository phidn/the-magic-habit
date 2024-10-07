import { baseColorMap, ColorName } from '@mazic/config/baseColors'
import { useStore } from '@mazic/store/useStore'

export const useColorMode = (color: string) => {
  const mode = useStore((state) => state.theme.mode)
  const _color = baseColorMap.get(color as ColorName)

  return {
    mode,
    colorMode: _color ? `hsl(${_color?.activeColor?.[mode]})` : 'var(--primary)',
  }
}
