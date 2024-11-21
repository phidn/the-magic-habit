import { baseColorMap, ColorName } from '@mazic/shared'
import { useStore } from '@mazic/store/useStore'

export const useColorMode = (color: string | undefined) => {
  const mode = useStore((state) => state.theme.mode)
  const _color = baseColorMap.get(color as ColorName)

  return {
    mode,
    colorMode: _color ? `hsl(${_color?.activeColor?.[mode]})` : 'var(--primary)',
  }
}
